export const ROUTES = {
  HOME: '/home',
  DASHBOARD: '/userdashboard',
  MARKET: '/textbookmarket',
  CART: '/cart',
  SALE: '/sale'
};

export const getRouteByPage = (page) => {
  const routes = {
    'Home': ROUTES.HOME,
    'UserDashboard': ROUTES.DASHBOARD,
    'Textbook Market': ROUTES.MARKET,
    'Cart': ROUTES.CART,
    'Sale': ROUTES.SALE
  };
  
  return routes[page];
};