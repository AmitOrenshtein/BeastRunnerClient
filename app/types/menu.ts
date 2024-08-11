export interface GenericMenuItemProps {
    title: string,
    onItemPress: () => void,
    keepMenuOpen: boolean,
    trailingIcon?: any
}

export interface GenericMenuProps {
    menuItems: GenericMenuItemProps[];
}
