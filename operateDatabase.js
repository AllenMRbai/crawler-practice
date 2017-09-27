const Sequelize=require('sequelize');
const config=require('./config');

var sequelize=new Sequelize(config.database,config.username,config.password,{
	host:config.host,
	dialect:'mysql',
	pool:{
		max:5,
		min:0,
		idle:30000
	}
});

//判断是否成功链接数据库
/*sequelize
	.authenticate()
	.then(()=>{
		console.log('success excuting the database')
	})
	.catch(err=>{
		console.error('Unable to connect to the database',err);
	})*/

//产品主表
const Product=sequelize.define('product',{
	//产品短名字
	productShortName:{
		type:Sequelize.STRING(100),
	},
	//优惠券
	voucher:{
		type:Sequelize.FLOAT(7,2)
	},
	//券后价
	priceAfterDiscount:{
		type:Sequelize.FLOAT(7,2)
	},
	//销量
	salesVolume:{
		type:Sequelize.BIGINT
	},
	//产品主图
	productMainPic:{
		type:Sequelize.STRING(150)
	},
	//产品购买链接
	productPurchaseLink:{
		type:Sequelize.STRING(150),
		primaryKey:true
	},
	//领券链接
	productVoucherLink:{
		type:Sequelize.STRING(150)
	}
})

//产品详细信息表
const ProductDetail=sequelize.define('productdetail',{
	id:{
		type:Sequelize.BIGINT,
		primaryKey:true,
		autoIncrement: true 
	},
	//产品长名字
	productLongName:{
		type:Sequelize.STRING(100)	
	},
	//选项
	productOptions:{
		type:Sequelize.TEXT
	},
	detailPictures:{
		type:Sequelize.TEXT
	}
	
})

Product.hasOne(ProductDetail,{as:'prodd',foreignKey:'purchaseLink'})
ProductDetail.belongsTo(Product,{as:'pro',foreignKey:'purchaseLink'})

const User=sequelize.define('user',{
	userName:{
		type:Sequelize.STRING,
		primaryKey:true
	},
	password:{
		type:Sequelize.STRING
	},
	nickName:{
		type:Sequelize.STRING,
		allowNull:false,
		defaultValue:"empty"
	}
})

module.exports={
	Product,
	User,
	ProductDetail
}


var pOpts=[
	{
		title:'尺寸',
		opts:[
			{name:'150x200cn,夏被1.4斤',price:97.50},
			{name:'180x220cm,夏被1.8斤',price:122.50},
			{name:'200x230cm,夏被2.4斤',price:147.50},
			{name:'150x200cm,春秋3斤',price:124.75},
			{name:'150x200cm,冬被5斤',price:162.50},
			{name:'150x200cm,加厚6斤',price:187.50},
			{name:'180x220cm,春秋4斤',price:182.50},
			{name:'180x220cm,冬被5斤',price:197.50},
			{name:'180x220cm,加厚6斤',price:212.50},
			{name:'200x230cm,春秋5斤',price:197.50},
			{name:'200x230cm,冬被6斤',price:212.50},
			{name:'200x230cm,加厚8斤',price:237.50},
			{name:'220x240cm,冬被8斤',price:247.50}
		]
	},
	{
		title:'颜色分类',
		opts:[
			'简爱',
			'安逸',
			'致青春',
			'格调-豆沙',
			'格调-绿色',
			'格调-米黄',
			'柔情岁月',
			'绚丽人生',
			'纯色诱惑',
			'开心一乐',
			'欧式冬被'
		]
	}
]

var strOpts=JSON.stringify(pOpts);

var pDet=[
	'https://img.alicdn.com/imgextra/i1/2097624044/TB2Nby0geALL1JjSZFjXXasqXXa_!!2097624044.gif',
	'https://img.alicdn.com/imgextra/i4/2097624044/TB2d.lHXEifF1JjSszcXXc2qpXa_!!2097624044.jpg',
	'https://img.alicdn.com/imgextra/i2/2097624044/TB2cIWpXvDWJKJjSZPhXXXQ5pXa_!!2097624044.jpg',
	'https://img.alicdn.com/imgextra/i2/2097624044/TB2gVTLXGKIJuJjSZFxXXavHVXa_!!2097624044.jpg',
	'https://img.alicdn.com/imgextra/i2/2097624044/TB2SFYLXGKIJuJjSZFxXXavHVXa_!!2097624044.jpg',
	'https://img.alicdn.com/imgextra/i2/2097624044/TB2YjbNXN5GJuJjSZFFXXagvFXa_!!2097624044.jpg',
	'https://img.alicdn.com/imgextra/i2/2097624044/TB2kurIXPGHJuJjSZFPXXbBFpXa_!!2097624044.jpg',
	'https://img.alicdn.com/imgextra/i1/2097624044/TB2Z_vKXNuGJuJjSZPiXXcqOpXa_!!2097624044.jpg',
	'https://img.alicdn.com/imgextra/i1/2097624044/TB2MUTfXsiEJuJjy1zeXXcnMpXa_!!2097624044.jpg',
	'https://img.alicdn.com/imgextra/i4/2097624044/TB2KpQPXk2kJKJjSspcXXbS1pXa_!!2097624044.jpg',
	'https://img.alicdn.com/imgextra/i1/2097624044/TB23O8NXSyEJuJjSszfXXcJAVXa_!!2097624044.jpg',
	'https://img.alicdn.com/imgextra/i1/2097624044/TB256h2XBcHL1JjSZJiXXcKcpXa_!!2097624044.jpg',
	'https://img.alicdn.com/imgextra/i3/2097624044/TB2qL82XEUIL1JjSZFrXXb3xFXa_!!2097624044.jpg',
	'https://img.alicdn.com/imgextra/i3/2097624044/TB2VniEXOwIL1JjSZFsXXcXFFXa_!!2097624044.jpg',
	'https://img.alicdn.com/imgextra/i2/2097624044/TB2pQdTXi0TMKJjSZFNXXa_1FXa_!!2097624044.jpg',
	'https://img.alicdn.com/imgextra/i4/2097624044/TB2fjWyXMkLL1JjSZFpXXa7nFXa_!!2097624044.jpg',
	'https://img.alicdn.com/imgextra/i2/2097624044/TB2iyr9Xi2mJKJjy0FhXXckoXXa_!!2097624044.jpg',
	'https://img.alicdn.com/imgextra/i2/2097624044/TB2_rCHXSuFJuJjSZJiXXXC4XXa_!!2097624044.jpg',
	'https://img.alicdn.com/imgextra/i3/2097624044/TB2ueaLXSGFJuJjSZFwXXa.iFXa_!!2097624044.jpg',
	'https://img.alicdn.com/imgextra/i1/2097624044/TB2mH_.XinmJKJjy0FdXXboDVXa_!!2097624044.jpg'
]

var strDet=JSON.stringify(pDet);

// Product.destroy({where:{productShortName:'这是个测试 女士碎花群'}})
// ProductDetail.destroy({where:{productLongName:'这是测试 产品长名'}})

//建表
try{
	/*User.sync({force:true}).then(()=>{
		return User.create({
			userName:'15757823084',
			password:'123456',
			nickName:'夜猫子'
		});
	});*/
	/*Product.sync({force:true}).then(()=>{
		return Product.create({
			productShortName:'这是个测试 女士碎花群',//string(50)
			voucher:50.22,//float(7,2)
			priceAfterDiscount:88.50,//float(7,2)
			salesVolume:4562,//bigInt
			productMainPic:'http://iqcard.cn/product.jpeg',//string(150)
			productPurchaseLink:'http://iqcard.cn/',//string(150)
			productVoucherLink:'http://iqcard.cn/'//string(150)
		});
	});*/
	
	sequelize.sync({force:true}).then(async()=>{
		await ProductDetail.create({
			productLongName:'冬季被子加厚保暖冬被芯学生宿舍太空棉被双人空调被单人春秋被褥',
			productOptions:strOpts,
			detailPictures:strDet
		})
	});
}catch(err){
	console.log(err);
}

//查找
/*Product.findOne({
	where:{productName:'春秋款男士宽大牛仔裤'},
	attributes:['voucher',['productName','afterPrice']]
}).then(product=>{
	console.log(JSON.stringify(product));
})*/





//商品可选属性
/*[
	{
		title:'尺寸',
		opts:[
			{name:'150x200cn,夏被1.4斤',price:97.50},
			{name:'180x220cm,夏被1.8斤',price:122.50},
			{name:'200x230cm,夏被2.4斤',price:147.50},
			{name:'150x200cm,春秋3斤',price:124.75},
			{name:'150x200cm,冬被5斤',price:162.50},
			{name:'150x200cm,加厚6斤',price:187.50},
			{name:'180x220cm,春秋4斤',price:182.50},
			{name:'180x220cm,冬被5斤',price:197.50},
			{name:'180x220cm,加厚6斤',price:212.50},
			{name:'200x230cm,春秋5斤',price:197.50},
			{name:'200x230cm,冬被6斤',price:212.50},
			{name:'200x230cm,加厚8斤',price:237.50},
			{name:'220x240cm,冬被8斤',price:247.50}
		]
	},
	{
		title:'颜色分类',
		opts:[
			'简爱',
			'安逸',
			'致青春',
			'格调-豆沙',
			'格调-绿色',
			'格调-米黄',
			'柔情岁月',
			'绚丽人生',
			'纯色诱惑',
			'开心一乐',
			'欧式冬被'
		]
	}
]*/

//商品可选属性 版本二
/*[
	{
		title:'尺寸',
		opts:[
			'150x200cn,夏被1.4斤',
			'180x220cm,夏被1.8斤',
			'200x230cm,夏被2.4斤',
			'150x200cm,春秋3斤',
			'150x200cm,冬被5斤',
			'150x200cm,加厚6斤',
			'180x220cm,春秋4斤',
			'180x220cm,冬被5斤',
			'180x220cm,加厚6斤',
			'200x230cm,春秋5斤',
			'200x230cm,冬被6斤',
			'200x230cm,加厚8斤',
			'220x240cm,冬被8斤'
		]
	},
	{
		title:'颜色分类',
		opts:[
			'简爱',
			'安逸',
			'致青春',
			'格调-豆沙',
			'格调-绿色',
			'格调-米黄',
			'柔情岁月',
			'绚丽人生',
			'纯色诱惑',
			'开心一乐',
			'欧式冬被'
		]
	}
]*/

//详情页
/*[
	'https://img.alicdn.com/imgextra/i1/2097624044/TB2Nby0geALL1JjSZFjXXasqXXa_!!2097624044.gif',
	'https://img.alicdn.com/imgextra/i4/2097624044/TB2d.lHXEifF1JjSszcXXc2qpXa_!!2097624044.jpg',
	'https://img.alicdn.com/imgextra/i2/2097624044/TB2cIWpXvDWJKJjSZPhXXXQ5pXa_!!2097624044.jpg',
	'https://img.alicdn.com/imgextra/i2/2097624044/TB2gVTLXGKIJuJjSZFxXXavHVXa_!!2097624044.jpg',
	'https://img.alicdn.com/imgextra/i2/2097624044/TB2SFYLXGKIJuJjSZFxXXavHVXa_!!2097624044.jpg',
	'https://img.alicdn.com/imgextra/i2/2097624044/TB2YjbNXN5GJuJjSZFFXXagvFXa_!!2097624044.jpg',
	'https://img.alicdn.com/imgextra/i2/2097624044/TB2kurIXPGHJuJjSZFPXXbBFpXa_!!2097624044.jpg',
	'https://img.alicdn.com/imgextra/i1/2097624044/TB2Z_vKXNuGJuJjSZPiXXcqOpXa_!!2097624044.jpg',
	'https://img.alicdn.com/imgextra/i1/2097624044/TB2MUTfXsiEJuJjy1zeXXcnMpXa_!!2097624044.jpg',
	'https://img.alicdn.com/imgextra/i4/2097624044/TB2KpQPXk2kJKJjSspcXXbS1pXa_!!2097624044.jpg',
	'https://img.alicdn.com/imgextra/i1/2097624044/TB23O8NXSyEJuJjSszfXXcJAVXa_!!2097624044.jpg',
	'https://img.alicdn.com/imgextra/i1/2097624044/TB256h2XBcHL1JjSZJiXXcKcpXa_!!2097624044.jpg',
	'https://img.alicdn.com/imgextra/i3/2097624044/TB2qL82XEUIL1JjSZFrXXb3xFXa_!!2097624044.jpg',
	'https://img.alicdn.com/imgextra/i3/2097624044/TB2VniEXOwIL1JjSZFsXXcXFFXa_!!2097624044.jpg',
	'https://img.alicdn.com/imgextra/i2/2097624044/TB2pQdTXi0TMKJjSZFNXXa_1FXa_!!2097624044.jpg',
	'https://img.alicdn.com/imgextra/i4/2097624044/TB2fjWyXMkLL1JjSZFpXXa7nFXa_!!2097624044.jpg',
	'https://img.alicdn.com/imgextra/i2/2097624044/TB2iyr9Xi2mJKJjy0FhXXckoXXa_!!2097624044.jpg',
	'https://img.alicdn.com/imgextra/i2/2097624044/TB2_rCHXSuFJuJjSZJiXXXC4XXa_!!2097624044.jpg',
	'https://img.alicdn.com/imgextra/i3/2097624044/TB2ueaLXSGFJuJjSZFwXXa.iFXa_!!2097624044.jpg',
	'https://img.alicdn.com/imgextra/i1/2097624044/TB2mH_.XinmJKJjy0FdXXboDVXa_!!2097624044.jpg'
]*/