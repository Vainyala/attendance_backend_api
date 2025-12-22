// Date: 12 Dec 2025
// Author: Suresh Gupta
// Location: Indirapuram, Ghaziabad

import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import { env } from './config/env.js';
import './config/mariadb.js';
import './config/mongodb.js';

import { requestContext } from './middleware/requestContext.js';
import authRoutes from './routes/authRoutes.js';
import organizationRoutes from './routes/organizationRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js'
import shiftRoutes from './routes/shiftRoutes.js'
import projectSiteRoutes from './routes/projectSiteRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js'
import healthRoutes from './routes/healthRoutes.js';
import regularizationRoutes from './routes/regularizationRoutes.js'
import syncRoutes from './routes/syncRoutes.js';
import employeeMappedProjectsRoutes from './routes/employeeMappedProjectsRoutes.js';
const app = express();

// Your existing middleware
app.use(express.json());

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(requestContext);
app.use(morgan('combined'));

// Register Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/organizations', organizationRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/employee', employeeRoutes);
app.use('/api/v1/shift', shiftRoutes);
app.use('/api/v1/attendance',attendanceRoutes);
app.use('/api/v1/regularization', regularizationRoutes);
app.use('/api/v1/projects_site', projectSiteRoutes);
app.use('/api/v1/emp_mapped_projects', employeeMappedProjectsRoutes);

//manual Sync icon click
app.use('/api/v1/sync', syncRoutes);


// Health
app.get('/health', (_req, res) => res.status(200).json({ ok: true, env: env.nodeEnv }));
app.use('/api/v1/health', healthRoutes);

// 404
app.use((_req, res) => res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found' } }));

// Error handler (last)
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Unexpected error' } });
});

app.listen(env.port, () => {
  console.log(`attendancebackend listening on port ${env.port}`);
});
