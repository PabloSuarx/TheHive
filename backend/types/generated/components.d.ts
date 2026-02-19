import type { Schema, Struct } from '@strapi/strapi';

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
      'footer.footer-link': FooterFooterLink;
      'footer.social-media': FooterSocialMedia;
      'main-image.main-image': MainImageMainImage;
      'menu-item.menu-item': MenuItemMenuItem;
      'orders.order-item': OrdersOrderItem;
      'shared.seo': SharedSeo;
      'stat.feature': StatFeature;
      'stat.stat-item': StatStatItem;
      'ui.button': UiButton;
      'ui.common-text': UiCommonText;
      'user.addresses': UserAddresses;
    }
  }
}
