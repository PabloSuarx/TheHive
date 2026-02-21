import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::cart-item.cart-item', ({ strapi }) => ({
  async create(ctx) {
    const { data } = ctx.request.body;
    const entry = await strapi.entityService.create('api::cart-item.cart-item', {
      data: {
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        product: data.product,
        users_permissions_user: data.users_permissions_user,
      },
      populate: { product: { populate: ['mainImage'] } },
    });
    return { data: entry };
  },

  async find(ctx) {
    const { results, pagination } = await strapi.entityService.findPage('api::cart-item.cart-item', {
      ...ctx.query,
      populate: { product: { populate: ['mainImage'] } },
    });
    return { data: results, meta: { pagination } };
  },
}));
