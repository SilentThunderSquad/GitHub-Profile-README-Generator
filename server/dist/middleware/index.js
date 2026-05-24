import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { generalLimiter } from './rateLimiter';
/**
 * Configure all middleware in production-ready order
 * Middleware order is critical for security and performance
 */
export const configureMiddleware = (app, frontendUrl) => {
    // 1. Security headers (must be first)
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", 'data:', 'https:'],
            },
        },
        hsts: {
            maxAge: 31536000, // 1 year
            includeSubDomains: true,
            preload: true,
        },
    }));
    // 2. CORS (before body parsing for preflight requests)
    const corsOptions = {
        origin: frontendUrl,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        maxAge: 86400, // 24 hours
    };
    app.use(cors(corsOptions));
    // 3. Request logging (before body parsing to log complete requests)
    app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms', {
        skip: (req) => {
            // Skip health checks in logs
            return req.path === '/api/health';
        },
    }));
    // 4. Body parsing (JSON and URL-encoded)
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ limit: '10mb', extended: true }));
    // 5. Rate limiting (protect against brute force and DDoS)
    app.use(generalLimiter);
    // 6. Request ID middleware (for tracing)
    app.use((req, res, next) => {
        req.id = req.headers['x-request-id'] || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        res.setHeader('X-Request-ID', req.id);
        next();
    });
    // 7. Custom request logging middleware
    app.use((req, res, next) => {
        const startTime = Date.now();
        // Log response when complete
        res.on('finish', () => {
            const duration = Date.now() - startTime;
            const logLevel = res.statusCode >= 400 ? 'error' : 'info';
            console.log(`[${logLevel.toUpperCase()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms) [ID: ${req.id}]`);
        });
        next();
    });
    // 8. Request validation middleware (optional, can be used selectively)
    app.use((req, res, next) => {
        // Validate content-type for POST/PUT/PATCH
        if (['POST', 'PUT', 'PATCH'].includes(req.method) && !req.is('application/json')) {
            if (req.get('content-length') && req.get('content-length') !== '0') {
                return res.status(415).json({
                    success: false,
                    error: 'Content-Type must be application/json',
                    code: 'INVALID_CONTENT_TYPE',
                    statusCode: 415,
                    timestamp: new Date().toISOString(),
                });
            }
        }
        next();
    });
};
//# sourceMappingURL=index.js.map