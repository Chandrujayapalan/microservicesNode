

module.exports = (sequelize, DataTypes) => {
	const orders  = sequelize.define(
		"order",
		{
			id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            items:{ type: DataTypes.JSON },
            date: { type: DataTypes.INTEGER},
            total:{ type: DataTypes.INTEGER },
			userId:   {type: DataTypes.INTEGER , ref :'userMaster'}, 
			deleted :{type: DataTypes.BOOLEAN },
			createdAt: { type: DataTypes.DATE },
			updatedAt: { type: DataTypes.DATE },
           
		},
	
		{
			freezeTableName: true,
			indexes: [
				{
					unique: true,
					fields: ['id']
				}
			]
		}
	);
	
	orders.associate = function (models) {
		orders.belongsTo(models.userMaster,{
			foreignKey: 'userId',
			as: 'userMaster'
		})
		orders.hasMany(models.product,{
			foreignKey: 'id',
			as: 'product'
		})
	}
	// orders.belongsTo(userMaster,{foreignKey: 'userId',targetKey: 'userId'})

	return orders;
};
