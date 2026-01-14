// Date: 12 Dec 2025
// Author: Suresh Gupta
// Location: Indirapuram, Ghaziabad

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const { env } = require('./config/env.js');

// Initialize DB connections (these modules export promises)
const { mariadb } = require('./config/mariadb.js');
const { mongo } = require('./config/mongodb.js');

const { requestContext } = require('./middleware/requestContext.js');
const authRoutes = require('./routes/authRoutes.js');
const organizationRoutes = require('./routes/organizationRoutes.js');
const projectRoutes = require('./routes/projectRoutes.js');
const employeeRoutes = require('./routes/employeeRoutes.js');
const shiftRoutes = require( './routes/shiftRoutes.js');
const projectSiteRoutes = require( './routes/projectSiteRoutes.js');
const attendanceRoutes = require( './routes/attendanceRoutes.js');
const healthRoutes = require( './routes/healthRoutes.js');
const regularizationRoutes = require( './routes/regularizationRoutes.js');
const leavesRoutes = require( './routes/leavesRoutes.js');
const syncRoutes = require( './routes/syncRoutes.js');
const employeeMappedShiftsRoutes = require( './routes/employeeMappedShiftsRoutes.js');
const employeeMappedProjectsRoutes = require( './routes/employeeMappedProjectsRoutes.js');
const attendanceAnalyticsRoutes = require( './routes/attendanceAnalyticsRoutes.js');


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
app.use('/api/v1/leaves', leavesRoutes);
//app.use('/api/v1/timesheet', timesheetRoutes);
app.use('/api/v1/projects_site', projectSiteRoutes);
app.use('/api/v1/emp_mapped_projects', employeeMappedProjectsRoutes);
app.use('/api/v1/emp_mapped_shifts', employeeMappedShiftsRoutes);
app.use('/api/v1/attendance_analytics', attendanceAnalyticsRoutes);

//manual Sync icon click
app.use('/api/v1/sync', syncRoutes);


// Health
app.get('/health', (_req, res) => res.status(200).json({ ok: true, env: env.nodeEnv }));
app.use('/api/v1/health', healthRoutes);

// 404
app.use((_req, res) => res.status(404).json({ 
  success: false, error: { code: 'NOT_FOUND', message: 'Route not found' } }));

// Error handler (last)
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).json({ 
    success: false, error: { code: 'SERVER_ERROR', message: 'Unexpected error' } });
});

// app.listen(env.port, '0.0.0.0', () => {
//   console.log(`attendancebackend listening on port ${env.port}`);
// });
  // Start server only after DB connections are ready
Promise.all([mariadb, mongo])
  .then(() => {
    app.listen(env.port, () => {
      console.log(`attendancebackend listening on port ${env.port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize databases:', err);
    process.exit(1);
  });

