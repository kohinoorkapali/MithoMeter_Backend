import { Sequelize } from "sequelize";



export const sequelize = new Sequelize(
  "mithometer",    
  "postgres",     
  "postgresql",    
  {
    host: "localhost",
    dialect: "postgres",
    
  }
);

export const connection = async () => {
  try {
    await sequelize.authenticate(); 
    await sequelize.sync({alter:true});         
    console.log("Database connected successfully");
  } catch (e) {
    console.error("Database connection failed:", e.message);
  }
};
