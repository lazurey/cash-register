"use strict"

var assert = require('assert');
var CashRegister = require('../CashRegister');

describe('Test Cash Register', () => {
  it('should print all promotion goods details in this receipt', () => {
    const goods_list = [
        'ITEM000001',
        'ITEM000001',
        'ITEM000001',
        'ITEM000001',
        'ITEM000001',
        'ITEM000003-2',
        'ITEM000005',
        'ITEM000005',
        'ITEM000005'
    ]
    let machine = new CashRegister()
    
    let expect_receipt = `***<没钱赚商店>购物清单***
名称：羽毛球，数量：5个，单价：1.00(元)，小计：4.00(元)
名称：苹果，数量：2斤，单价：5.50(元)，小计：10.45(元)，节省0.55(元)
名称：可口可乐，数量：3瓶，单价：3.00(元)，小计：6.00(元)
----------------------
买二赠一商品：
名称：羽毛球，数量：1个
名称：可口可乐，数量：1瓶
----------------------
总计：20.45(元)
节省：4.55(元)
**********************`
    assert.equal(expect_receipt, machine.process(goods_list))
  })

  it('should print buy 2 get 1 free list in receipt', () => {
    const goods_list = [
        'ITEM000001',
        'ITEM000001',
        'ITEM000001',
        'ITEM000001',
        'ITEM000001',
        'ITEM000005',
        'ITEM000005',
        'ITEM000005'
    ]

    let machine = new CashRegister()
    let expect_receipt = `***<没钱赚商店>购物清单***
名称：羽毛球，数量：5个，单价：1.00(元)，小计：4.00(元)
名称：可口可乐，数量：3瓶，单价：3.00(元)，小计：6.00(元)
----------------------
买二赠一商品：
名称：羽毛球，数量：1个
名称：可口可乐，数量：1瓶
----------------------
总计：10.00(元)
节省：4.00(元)
**********************`
    assert.equal(expect_receipt, machine.process(goods_list))
  })

  it('should omit promotion list if no promotion goods', () => {
    const goods_list = [
      'ITEM000006-3'
    ]
    let machine = new CashRegister()
    let expect_receipt = `***<没钱赚商店>购物清单***
名称：没有任何优惠的口香糖，数量：3瓶，单价：10.00(元)，小计：30.00(元)
----------------------
总计：30.00(元)
**********************`
    assert.equal(expect_receipt, machine.process(goods_list))
  })

  it('should print saving amount when 95% promotion goods in list', () => {
    const goods_list = [
      'ITEM000003-2'
    ]
    let expect_receipt = `***<没钱赚商店>购物清单***
名称：苹果，数量：2斤，单价：5.50(元)，小计：10.45(元)，节省0.55(元)
----------------------
总计：10.45(元)
节省：0.55(元)
**********************`
    let machine = new CashRegister()
    assert.equal(expect_receipt, machine.process(goods_list))
  })

})
