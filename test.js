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

//1.证明在windows内表的名字是无视大小写的
//证明结果：在windows内是无视大小写的

//2.证明hasOne建立的关联，只有source模型有get,set方法。如果target模型也想要该方法必再加个belongTo方法
//

//3.证明相互的使用hasOne和belongTo方法只会产生一个foreignKey
//
const UserTest=sequelize.define('UserTest',{
	id:{
		type:Sequelize.INTEGER,
		autoIncrement:true,
		primaryKey:true
	},
	name:{
		type:Sequelize.STRING(10)
	},
	age:{
		type:Sequelize.INTEGER
	}
})

const CarTest=sequelize.define('carTest',{
	id:{
		type:Sequelize.INTEGER,
		autoIncrement:true,
		primaryKey:true
	},
	color:{
		type:Sequelize.STRING(10)
	},
	brand:{
		type:Sequelize.STRING(10)
	}
})
//建立关系
UserTest.hasOne(CarTest,{as:'car',foreignKey:'human_id'})
CarTest.belongsTo(UserTest,{as:'user',foreignKey:'human_id'})
try{
	//建表
	/*UserTest.sync({force:true}).then(()=>{
		return UserTest.create({
			name:'夜猫子',
			age:26
		});
	});
	CarTest.sync({force:true}).then(()=>{
		return CarTest.create({
			color:'深蓝色',
			brand:'奔驰'
		});
	});*/

	//测试get和set方法
	sequelize.sync().then(async ()=>{
		let user=await UserTest.findOne({where:{name:'夜猫子'}});
		let car=await CarTest.findOne({where:{id:1}});
		await user.setCar(car);
		let getcar=await user.getCar()
		let getuser=await car.getUser()

		console.log(getuser.get({plain:true}));
		console.log(getcar.get({plain:true}));
	});

}catch(err){
	console.log(err);
}