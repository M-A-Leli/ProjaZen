import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database/SequelizeInit';
import User from './User';
import Project from './Project';

interface AssignmentAttributes {
    id: string;
    userId: string;
    projectId: string;
}

interface AssignmentCreationAttributes extends Optional<AssignmentAttributes, 'id'> {}

class Assignment extends Model<AssignmentAttributes, AssignmentCreationAttributes> implements AssignmentAttributes {
    private _id!: string;
    private _userId!: string;
    private _projectId!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Getters
    get id(): string {
        return this._id;
    }
    
    get userId(): string {
        return this._userId;
    }

    get projectId(): string {
        return this._projectId;
    }

    // Setters
    set id(value: string) {
        this._id = value;
    }

    set userId(value: string) {
        this._userId = value;
    }

    set projectId(value: string) {
        this._projectId = value;
    }
}

Assignment.init({
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
        unique: true,
    },
    projectId: {
        type: DataTypes.UUID,
        references: {
            model: Project,
            key: 'id',
        },
    }
}, {
    sequelize,
    modelName: 'Assignment',
    timestamps: false,
});

User.hasOne(Assignment, { foreignKey: 'userId' });
Project.hasMany(Assignment, { foreignKey: 'projectId' });
Assignment.belongsTo(User, { foreignKey: 'userId' });
Assignment.belongsTo(Project, { foreignKey: 'projectId' });

export default Assignment;
