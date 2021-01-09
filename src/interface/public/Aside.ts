export interface AsideNavChildrenInterface {
  id: string,
  path: string,
  text: string
}

export interface AsideNavInterface {
  id: string,
  path: string,
  text: string,
  children: AsideNavChildrenInterface[]
}