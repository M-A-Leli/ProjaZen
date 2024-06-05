import { Model, DataTypes ,Optional } from 'sequelize';
import sequelize from '../database/SequelizeInit';
import User from './User';
import Project from './Project';

interface NotificationAttributes {
    id: string;
    userId: string;
    message: string;
    read: boolean;
}

interface NotificationCreationAttributes extends Optional<NotificationAttributes, 'id'> {}

class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {
    private _id!: string;
    private _userId!: string;
    private _message!: string;
    private _read!: boolean;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Getters
    get id(): string {
        return this._id;
    }

    get userId(): string {
        return this._userId;
    }

    get message(): string {
        return this._message;
    }

    get read(): boolean {
        return this._read;
    }

    // Setters
    set id(value: string) {
        this._id = value;
    }

    set userId(value: string) {
        this._userId = value;
    }

    set message(value: string) {
        this._message = value;
    }

    set read(value: boolean) {
        this._read = value;
    }
}

Notification.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        references: {
            model: User,
            key: 'id',
        },
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    sequelize,
    modelName: 'Notification',
    timestamps: false,
});

User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

export default Notification;
