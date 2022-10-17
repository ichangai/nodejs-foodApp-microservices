import express, { Application } from 'express';

import path from 'path';

import { AdminRoute, VendorRoute, ShopRoute, CustomerRoute } from '../routes';

export default async (app: Application) => {

    // Body parser middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/images', express.static(path.join(__dirname, 'images')));

    // Routes 
    // admin routes
    app.use('/admin', AdminRoute);
    // vendor routes
    app.use('/vendor', VendorRoute);
    // shop routes
    app.use(ShopRoute);
    // user routes
    app.use('/customer', CustomerRoute);

    return app;
}


