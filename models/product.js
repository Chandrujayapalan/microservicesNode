
module.exports = (sequelize, DataTypes) => {
	const product = sequelize.define(
		"product",
		{
			id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            productsName:{ type: DataTypes.STRING },
            productPrice: { type: DataTypes.INTEGER},
            productDescription:{ type: DataTypes.STRING },
			productReviews:   {type: DataTypes.STRING}, 
           
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
	// 	product.associate = function (models) {
	// 		product.hasMany(models.order, {
	// 		foreignKey: 'items',
	// 		as: 'order'
	// 	});
	// };

	return product;
};
