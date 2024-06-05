import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database/SequelizeInit';

interface UserAttributes {
    id: string;
    fname: string;
    lname: string;
    email: string;
    password: string;
    salt: string;
    role: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    private _id!: string;
    private _fname!: string;
    private _lname!: string;
    private _email!: string;
    private _password!: string;
    private _salt!: string;
    private _role!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Getters
    get id(): string {
        return this._id;
    }

    get fname(): string {
        return this._fname;
    }

    get lname(): string {
        return this._lname;
    }

    get email(): string {
        return this._email;
    }

    get password(): string {
        return this._password;
    }

    get salt(): string {
        return this._salt;
    }

    get role(): string {
        return this._role;
    }

    // Setters
    set fname(value: string) {
        this._fname = value;
    }

    set lname(value: string) {
        this._lname = value;
    }

    set email(value: string) {
        this._email = value;
    }

    set password(value: string) {
        this._password = value;
    }

    set salt(value: string) {
        this._salt = value;
    }

    set role(value: string) {
        this._role = value;
    }
}

User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    fname: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    lname: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    salt: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('admin', 'user'),
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'User',
    timestamps: true,
});

export default User;
