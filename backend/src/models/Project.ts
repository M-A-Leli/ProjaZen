import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database/SequelizeInit';

interface ProjectAttributes {
    id: string;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    status: string;
}

interface ProjectCreationAttributes extends Optional<ProjectAttributes, 'id'> { }

class Project extends Model<ProjectAttributes, ProjectCreationAttributes> implements ProjectAttributes {
    private _id!: string;
    private _name!: string;
    private _description!: string;
    private _startDate!: Date;
    private _endDate!: Date;
    private _status!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Getters
    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get description(): string {
        return this._description;
    }

    get startDate(): Date {
        return this._startDate;
    }

    get endDate(): Date {
        return this._endDate;
    }

    get status(): string {
        return this._status;
    }

    // Setters
    set id(value: string) {
        this._id = value;
    }

    set name(value: string) {
        this._name = value;
    }

    set description(value: string) {
        this._description = value;
    }

    set startDate(value: Date) {
        this._startDate = value;
    }

    set endDate(value: Date) {
        this._endDate = value;
    }

    set status(value: string) {
        this._status = value;
    }
}

Project.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('Unassigned', 'Assigned', 'Completed', 'Expired', 'Overdue'),
            allowNull: false,
            defaultValue: 'Unassigned',
        }
    },
    {
        sequelize,
        modelName: 'Project',
        timestamps: true,
    }
);

export default Project;
