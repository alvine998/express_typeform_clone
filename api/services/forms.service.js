const { Form, FormField } = require('../models');
const { Op } = require('sequelize');

module.exports = {
  async list({ status, page, limit, userId }) {
    try {
      const where = {};

      if (status) where.status = status;
      if (userId) where.created_by = userId;

      const pageNum = page || 1;
      const limitNum = limit || 10;
      const offset = (pageNum - 1) * limitNum;

      const fieldCountLiteral = Form.sequelize.literal(
        `(SELECT COUNT(*) FROM form_fields WHERE form_fields.form_id = Form.id)`
      );

      const { count, rows } = await Form.findAndCountAll({
        where,
        offset,
        limit: limitNum,
        attributes: {
          include: [[fieldCountLiteral, 'field_count']],
        },
        order: [['created_at', 'DESC']],
      });

      return {
        forms: rows,
        total: count,
        page: pageNum,
        totalPages: Math.ceil(count / limitNum),
      };
    } catch (error) {
      throw error;
    }
  },

  async getById(id) {
    try {
      const form = await Form.findByPk(id, {
        include: [
          {
            model: FormField,
            as: 'fields',
            order: [['field_order', 'ASC']],
          },
        ],
      });
      if (!form) {
        const e = new Error('Form not found'); e.statusCode = 404; throw e;
      }
      return form;
    } catch (error) {
      throw error;
    }
  },

  async create({ title, description, status, fields, createdBy }) {
    try {
      const form = await Form.create({
        title,
        description,
        status,
        created_by: createdBy,
      });

      if (fields && fields.length > 0) {
        const fieldEntries = fields.map((field, index) => ({
          form_id: form.id,
          type: field.type,
          label: field.label,
          placeholder: field.placeholder || null,
          required: field.required || false,
          options: field.options || null,
          field_order: field.field_order || index + 1,
        }));
        await FormField.bulkCreate(fieldEntries);
      }

      const result = await Form.findByPk(form.id, {
        include: [
          {
            model: FormField,
            as: 'fields',
            order: [['field_order', 'ASC']],
          },
        ],
      });

      return result;
    } catch (error) {
      throw error;
    }
  },

  async update(id, data) {
    try {
      const form = await Form.findByPk(id);
      if (!form) {
        const e = new Error('Form not found'); e.statusCode = 404; throw e;
      }

      const updateData = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.status !== undefined) updateData.status = data.status;
      await form.update(updateData);

      if (data.fields) {
        await FormField.destroy({ where: { form_id: id } });

        const fieldEntries = data.fields.map((field, index) => ({
          form_id: id,
          type: field.type,
          label: field.label,
          placeholder: field.placeholder || null,
          required: field.required || false,
          options: field.options || null,
          field_order: field.field_order || index + 1,
        }));
        await FormField.bulkCreate(fieldEntries);
      }

      const result = await Form.findByPk(id, {
        include: [
          {
            model: FormField,
            as: 'fields',
            order: [['field_order', 'ASC']],
          },
        ],
      });

      return result;
    } catch (error) {
      throw error;
    }
  },

  async remove(id) {
    try {
      const form = await Form.findByPk(id);
      if (!form) {
        const e = new Error('Form not found'); e.statusCode = 404; throw e;
      }
      await form.destroy();
      return true;
    } catch (error) {
      throw error;
    }
  },

  async duplicate(id) {
    try {
      const original = await Form.findByPk(id, {
        include: [
          {
            model: FormField,
            as: 'fields',
          },
        ],
      });
      if (!original) {
        const e = new Error('Form not found'); e.statusCode = 404; throw e;
      }

      const newForm = await Form.create({
        title: `${original.title} (Copy)`,
        description: original.description,
        status: 'draft',
        created_by: original.created_by,
      });

      if (original.fields && original.fields.length > 0) {
        const fieldEntries = original.fields.map((field) => ({
          form_id: newForm.id,
          type: field.type,
          label: field.label,
          placeholder: field.placeholder,
          required: field.required,
          options: field.options,
          field_order: field.field_order,
        }));
        await FormField.bulkCreate(fieldEntries);
      }

      const result = await Form.findByPk(newForm.id, {
        include: [
          {
            model: FormField,
            as: 'fields',
            order: [['field_order', 'ASC']],
          },
        ],
      });

      return result;
    } catch (error) {
      throw error;
    }
  },
};
