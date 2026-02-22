import type { Schema, Struct } from '@strapi/strapi';

export interface AboutUsInfoCard extends Struct.ComponentSchema {
  collectionName: 'components_about_us_info_cards';
  info: {
    displayName: 'Info Card';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Text;
    title: Schema.Attribute.Text;
  };
}

export interface BlogSortOption extends Struct.ComponentSchema {
  collectionName: 'components_blog_sort_options';
  info: {
    displayName: 'Sort Option';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface CategoriaSortOption extends Struct.ComponentSchema {
  collectionName: 'components_categoria_sort_options';
  info: {
    description: 'Opci\u00F3n de ordenaci\u00F3n para productos';
    displayName: 'Sort Option';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface FaqFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_faq_faq_items';
  info: {
    displayName: 'FAQ Item';
  };
  attributes: {
    answer: Schema.Attribute.Text & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface FooterFooterLink extends Struct.ComponentSchema {
  collectionName: 'components_footer_footer_links';
  info: {
    displayName: 'footerLink';
    icon: 'arrowDown';
  };
  attributes: {
    column: Schema.Attribute.Enumeration<
      ['General', 'Legal', 'Ayuda', 'Empresa']
    >;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface FooterSocialMedia extends Struct.ComponentSchema {
  collectionName: 'components_footer_social_medias';
  info: {
    displayName: 'socialMedia';
    icon: 'thumbUp';
  };
  attributes: {
    icon: Schema.Attribute.Text;
    platform: Schema.Attribute.Enumeration<
      [
        'Instagram',
        '  Facebook',
        '  Twitter',
        '  LinkedIn',
        '  YouTube',
        '  TikTok',
      ]
    >;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface MainImageMainImage extends Struct.ComponentSchema {
  collectionName: 'components_main_image_main_images';
  info: {
    displayName: 'mainImage';
  };
  attributes: {
    alternativeText: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images', true>;
  };
}

export interface MenuItemMenuItem extends Struct.ComponentSchema {
  collectionName: 'components_menu_item_menu_items';
  info: {
    displayName: 'MenuItem';
    icon: 'bulletList';
  };
  attributes: {
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    newTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    order: Schema.Attribute.Integer;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface OrdersOrderItem extends Struct.ComponentSchema {
  collectionName: 'components_orders_order_items';
  info: {
    displayName: 'OrderItem';
  };
  attributes: {
    product: Schema.Attribute.Relation<'oneToOne', 'api::product.product'>;
    quantity: Schema.Attribute.Integer;
    totalPrice: Schema.Attribute.Decimal;
    unitPrice: Schema.Attribute.Decimal;
  };
}

export interface ProductoQuickDetail extends Struct.ComponentSchema {
  collectionName: 'components_producto_quick_details';
  info: {
    displayName: 'Quick Detail';
  };
  attributes: {
    field: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'seo';
    icon: 'slideshow';
  };
  attributes: {
    canonicalURL: Schema.Attribute.String;
    keywords: Schema.Attribute.String;
    metaDescription: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    noFollow: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    noIndex: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    ogImage: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface ShippingContentSection extends Struct.ComponentSchema {
  collectionName: 'components_shipping_content_sections';
  info: {
    description: 'Secci\u00F3n de contenido con t\u00EDtulo y texto';
    displayName: 'Content Section';
    icon: 'file';
  };
  attributes: {
    content: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ShippingShippingZone extends Struct.ComponentSchema {
  collectionName: 'components_shipping_shipping_zones';
  info: {
    description: 'Zona de env\u00EDo con descripci\u00F3n';
    displayName: 'Shipping Zone';
    icon: 'earth';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface StatFeature extends Struct.ComponentSchema {
  collectionName: 'components_stat_features';
  info: {
    displayName: 'feature';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface StatStatItem extends Struct.ComponentSchema {
  collectionName: 'components_stat_stat_items';
  info: {
    displayName: 'stat-item';
  };
  attributes: {
    label: Schema.Attribute.String;
    value: Schema.Attribute.String;
  };
}

export interface TestimonialsTestimonial extends Struct.ComponentSchema {
  collectionName: 'components_testimonials_testimonials';
  info: {
    displayName: 'Testimonial';
    icon: 'quote';
  };
  attributes: {
    author: Schema.Attribute.String & Schema.Attribute.Required;
    location: Schema.Attribute.String;
    rating: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<5>;
    text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface UiButton extends Struct.ComponentSchema {
  collectionName: 'components_ui_buttons';
  info: {
    displayName: 'button';
  };
  attributes: {
    content: Schema.Attribute.String & Schema.Attribute.Required;
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    link: Schema.Attribute.String & Schema.Attribute.Required;
    variant: Schema.Attribute.Enumeration<
      ['primary', 'secondary', 'outline', 'ghost']
    >;
  };
}

export interface UiCommonText extends Struct.ComponentSchema {
  collectionName: 'components_ui_common_texts';
  info: {
    displayName: 'CommonText';
  };
  attributes: {
    key: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface UserAddresses extends Struct.ComponentSchema {
  collectionName: 'components_user_addresses';
  info: {
    displayName: 'addresses';
  };
  attributes: {
    alias: Schema.Attribute.String;
    city: Schema.Attribute.String;
    country: Schema.Attribute.String;
    countryState: Schema.Attribute.String;
    isDefault: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    state: Schema.Attribute.String;
    street: Schema.Attribute.String;
    zipCode: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'about-us.info-card': AboutUsInfoCard;
      'blog.sort-option': BlogSortOption;
      'categoria.sort-option': CategoriaSortOption;
      'faq.faq-item': FaqFaqItem;
      'footer.footer-link': FooterFooterLink;
      'footer.social-media': FooterSocialMedia;
      'main-image.main-image': MainImageMainImage;
      'menu-item.menu-item': MenuItemMenuItem;
      'orders.order-item': OrdersOrderItem;
      'producto.quick-detail': ProductoQuickDetail;
      'shared.seo': SharedSeo;
      'shipping.content-section': ShippingContentSection;
      'shipping.shipping-zone': ShippingShippingZone;
      'stat.feature': StatFeature;
      'stat.stat-item': StatStatItem;
      'testimonials.testimonial': TestimonialsTestimonial;
      'ui.button': UiButton;
      'ui.common-text': UiCommonText;
      'user.addresses': UserAddresses;
    }
  }
}
