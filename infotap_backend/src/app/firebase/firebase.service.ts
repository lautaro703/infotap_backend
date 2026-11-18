import { Injectable } from '@nestjs/common';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { Auth, getAuth } from 'firebase-admin/auth';
import * as path from 'path';

@Injectable()
export class FirebaseService {
    private auth:Auth;
    constructor() {
        let app = getApps()[0];

        if (!app) {
            const rutaCredenciales = path.resolve(
                process.cwd(),
                'credentials',
                'firebase-service-account.json'
            );

            app = initializeApp({
                credential: cert(rutaCredenciales),
            });
        }
        this.auth = getAuth(app);
    }
    async verificarToken(token: string) {return await this.auth.verifyIdToken(token);}
}