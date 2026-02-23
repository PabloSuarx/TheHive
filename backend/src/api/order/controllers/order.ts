import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::order.order', ({ strapi }) => ({
  async create(ctx) {
    const { data } = ctx.request.body;

    const entry = await strapi.entityService.create('api::order.order', {
      data: {
        orderStatus: data.orderStatus,
        subtotal: data.subtotal,
        shippingCost: data.shippingCost,
        total: data.total,
        notes: data.notes,
        placedAt: data.placedAt,
        users_permissions_user: data.users_permissions_user,
        Orders: data.Orders,
        Address: data.Address,
      },
      populate: ['Orders', 'Address', 'users_permissions_user'],
    });

    return { data: entry };
  },
}));
