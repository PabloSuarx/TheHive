export interface ProductDataset extends DOMStringMap {
    price: string;
    origin: string;
}

export interface ProductCardElement extends HTMLElement {
    dataset: ProductDataset;
    style: CSSStyleDeclaration;
}
