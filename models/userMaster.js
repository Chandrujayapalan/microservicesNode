
module.exports = (sequelize, DataTypes) => {
	const userMaster = sequelize.define(
		"userMaster",
		{
			userId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
			firstName: { type: DataTypes.STRING},
		
			emailId: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false
			},
			password: { type: DataTypes.STRING },
			createdBy: { type: DataTypes.INTEGER, },
			updatedBy: { type: DataTypes.INTEGER },
			createdAt: { type: DataTypes.DATE },
			updatedAt: { type: DataTypes.DATE },
		
		},
	

		{
			freezeTableName: true,
			indexes: [
				{
					unique: true,
					fields: ['userId', 'emailId']
				}
			]
		}
	);
	// userMaster.associate = function (models) {
	// 	models.userMaster.hasMany(models.orders)
	// }
	// userMaster.hasOne(orders,{
	// 	as : 'order',
	// 	foreignKey: 'userId'
	// })
	// userMaster.associate = function (models) {
	// 	userMaster.hasMany(models.order, {
	// 		foreignKey: 'userId',
	// 		as: 'order'
	// 	});
	// };
	return userMaster;
};
