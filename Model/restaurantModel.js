import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js"; // your Sequelize instance

export const Restaurant = sequelize.define("Restaurant",{
    restaurantId:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    // userId:{
    //     type: DataTypes.INTEGER,
    //     autoIncrement: true,
    //     primaryKey: true,
    // },
    name:{
        type: DataTypes.STRING,
        allowNull:false
    },
    location:{
        type: DataTypes.STRING,
        allowNull:false
    },
    cuisines:{
        type:DataTypes.JSON,
        allowNull:false,
        defaultValue: []
    },
    priceRange:{
        type:DataTypes.JSON,
        allowNull:false,
        defaultValue: []
    },
    openTime:{
        type:DataTypes.TIME,
        allowNull:false
    },
    closeTime:{
        type:DataTypes.TIME,
        allowNull:false
    },
    description:{
        type: DataTypes.TEXT,
        allowNull:false
    },
    websiteLink:{
        type: DataTypes.STRING,
        allowNull:false
    },
    menuLink:{
        type: DataTypes.STRING,
        allowNull:false
    },
    moods:{
        type:DataTypes.JSON,
        allowNull:false,
        defaultValue: []
    },
    features:{
        type:DataTypes.JSON,
        allowNull:false,
        defaultValue: []
    },
    photos:{
        type:DataTypes.JSON,
        allowNull:false,
        defaultValue: []
    }
});

