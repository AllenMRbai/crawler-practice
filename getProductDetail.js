const phantom=require('phantom');
const fs=require('fs');
const tables=require('./operateDatabase');
const Sequelize=require('sequelize');

(async function(){
	try
	{	
		//设置用户代理头
		const userAgent = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36`
		//await解决回调问题，创建一个phantom实例
		const instance=await phantom.create();
		//通过phantom实例创建一个page对象
		const page=await instance.createPage();
		//获得product的个数
		let countAll=await tables.Product.count();
		//要查询的总个数
		let queryNumber=countAll;
		//每次查询个数
		let pace=1;
		//偏移
		let offset=0;
		//计算当前的索引
		let nowIndex=1;

		//循环products表内的所有商品，并一一将他们的详情内容添加到productDetails表内
		while(offset<queryNumber){
			let products=await tables.Product.findAll({offset,limit:pace});
			let productDetails=[];
			for(let i=0;i<pace;i++){
				let url=products[i].productPurchaseLink;
				const status=await page.open(url)
				if(status!=='success'){
					console.log(`第${i+offset}个商品详情打开 失败`);
					continue;
				}else{
					console.log(`第${i+offset}个商品详情打开 成功`);
					var result;

					if(url.indexOf('detail.tmall.com')!==-1){//这是个天猫网站
						console.log('这是个天猫网站');
						result=await page.evaluate(function(){
							var productDetail=new Object();
							/*productDetail={
								productLongName,//STRING(100)
								productOptions,//TEXT
								detailPictures//TEXT
							}*/
							
							getPD();
							//获得产品的信息信息
							function getPD(){
								//信息1 产品长名称
								productDetail.productLongName=document.querySelector('.tb-detail-hd h1').innerText;
								//信息2 获得销售属性
								productDetail.productOptions=getProps();
								//信息3 获得详情图片
								productDetail.detailPictures=getDpics();
							}

							//信息2 获得销售属性
							function getProps(){
								var saleProps=[]
								var domProps=document.querySelectorAll('.tm-sale-prop');
								var temProp;
								var x=0,domPropsLen=domProps.length;
								for(;x<domPropsLen;x++){
									temProp=new Object();
									if(domProps[x].className.indexOf('tm-img-prop')!==-1){//表示是个图片的属性
										temProp.propTitle=domProps[x].querySelector('.tb-metatit').innerText;
										temProp.propType='pic';
										temProp.propOptions=[];
										var domPicOptions=domProps[x].querySelectorAll('li');
										var temPicOption;
										for(var y=0;y<domPicOptions.length;y++){
											temPicOption=new Object();
											temPicOption.name=domPicOptions[y].querySelector('span').innerText;
											if(domPicOptions[y].querySelector('a').style.background.match(/url\("(.*)"\)/)){
												temPicOption.bg=domPicOptions[y].querySelector('a').style.background.match(/url\("(.*)"\)/)[1];
											}else{
												temPicOption.bg='没抓到'
											}
										
											temProp.propOptions.push(temPicOption);
											temPicOption=null;
										}
									}else{//表示是个文字的属性
										temProp.propTitle=domProps[x].querySelector('.tb-metatit').innerText;
										temProp.propType='txt';
										temProp.propOptions=[];
										var domTxtOptions=domProps[x].querySelectorAll('li');
										for(var z=0;z<domTxtOptions.length;z++){
											temProp.propOptions.push(domTxtOptions[z].querySelector('span').innerText);
										}

									}
									saleProps.push(temProp);
									temProp=null;
								}


								return JSON.stringify(saleProps);
							}

							function getDpics(){
								var detPics=[];
								var domContent=document.querySelectorAll('.content.ke-post');
								var domPics=domContent[0].querySelectorAll('p img.img-ks-lazyload');
								var len=domPics.length;
								for(var i=0;i<len;i++){
									detPics.push(domPics[i].attributes.src.textContent);
								}
								return JSON.stringify(detPics);
							}

							/*console.log(productDetail);*/
							return productDetail;
						})
					}else{//这是个淘宝网站
						console.log('这是个淘宝网站')
						result=await page.evaluate(function(){
							return [];
						})
					}
					
					result.purchaseLink=url;
					//console.log(result);
					productDetails.push(result);
				}

			}
			console.log()
			await tables.ProductDetail.bulkCreate(productDetails);
			offset+=pace;
			if(offset>=queryNumber){
				offset=queryNumber;
			}
		}

		console.log('所有数据添加完毕！')
		await instance.exit();
	}
	catch(e){
		console.log(e);
	}
}());