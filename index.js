const phantom=require('phantom');
const fs=require('fs');
const program=require('commander');
const tables=require('./operateDatabase');
const Sequelize=require('sequelize');

program
	.version('0.1.0')
	.option('-p,--pages [pages]','set how many pages to fetch')

const pageNumber=program.pages || 10;

(async function(){
	try
	{
		//await解决回调问题，创建一个phantom实例
		const instance=await phantom.create();
		//通过phantom实例创建一个page对象
		const page=await instance.createPage();
		//页面指向的是哪个url
		await page.on("onResourceRequested",function(requestData){
			//console.info('Requesting',requestData.url);
		});
		console.log(pageNumber);
		//得到打开该页面的状态码
		for(let i=1;i<=pageNumber;i++){
			let url=encodeURI(`http://www.dataoke.com/qlist/?page=${i}`)
			//设置用户代理头
			const userAgent = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36`

			const status=await page.open(url)
			if(status!=='success'){
				console.log(`第${i}页 访问失败`);
				return;
			}else{
				console.log(`第${i}页 访问成功`);
				let start=Date.now();

				let result=await page.evaluate(function(){
						var goodItems=$('.goods-item');
						var length=$('.goods-item').length;
						var products=[];

						function getProduct(ind){
							var tem=new Object();
							var url='/gettpl?gid='+$(goodItems[ind]).find('.go_info').data('gid');
				            $.ajax({
				                type:'get',
				                url:url,
				                async: false,
				                cache:false,
				                success:function(res){
				                    var reg=/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#\*]*[\w\-\@?^=%&/~\+#\*])?/g; 
				                    var urls=res.match(reg);
									tem.productMainPic=$(goodItems[ind]).find('.goods-img img.lazy').attr('data-original');//string(150)
									tem.productPurchaseLink=urls[3];//string(150)
									tem.productVoucherLink=urls[1];//string(150)
									tem.productShortName=$(goodItems[ind]).find('.goods-tit a').text().trim();//string(50)
									tem.voucher=Number($(goodItems[ind]).find('.goods-quan b').text().trim().match(/\d+(\.\d+)?/)[0]);//float(7,2)
									tem.priceAfterDiscount=Number($(goodItems[ind]).find('.goods-price p b').text().trim().match(/\d+(\.\d+)?/)[0]);//float(7,2)
									tem.salesVolume=Number($(goodItems[ind]).find('.goods-sale span.fl').text().trim().match(/\d+(\.\d+)?/)[0])*10000;//bigInt
									products.push(tem);
				                },
				                errer:function(){

				                }
				            });
				            
						}

						for(var o=0;o<length;o++){
							getProduct(o);
						}

						return products;
				});

				tables.Product.bulkCreate(result);
			}
		}
		await instance.exit();
	//输出该页面的内容
	/*const content=await page.property('content')
	fs.appendFile('./page.html',content,(err)=>{
		if(err) throw err;
		console.log('the "data to append" was appended to file!\n');
	})*/
	}
	catch(e){
		console.log(e);
	}
}());