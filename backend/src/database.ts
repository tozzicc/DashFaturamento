import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config: sql.config = {
  server: process.env.DB_SERVER || 'SRVFASTSQL',
  database: process.env.DB_NAME || 'PROTHEUS_PRODUCAO',
  authentication: {
    type: 'default',
    options: {
      userName: process.env.DB_USER || 'consulta',
      password: process.env.DB_PASSWORD || 'fastcon0321',
    },
  },
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableKeepAlive: true,
  },
};

let pool: sql.ConnectionPool;

export async function connectDB(): Promise<sql.ConnectionPool> {
  try {
    if (!pool) {
      pool = new sql.ConnectionPool(config);
      await pool.connect();
      console.log('✅ Conectado ao SQL Server com sucesso!');
    }
    return pool;
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error);
    throw error;
  }
}

export async function getConnection(): Promise<sql.ConnectionPool> {
  if (!pool) {
    return await connectDB();
  }
  return pool;
}

export async function closeDB(): Promise<void> {
  if (pool) {
    await pool.close();
    console.log('❌ Desconectado do SQL Server');
  }
}
