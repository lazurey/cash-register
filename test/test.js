"use strict"

var assert = require('assert');
var CashRegister = require('../CashRegister');

describe('Test Cash Register', () => {
  it('should print a receipt', () => {
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

// describe('Step by step test', () => {
//   var machine = new CashRegister()
//   describe('Read the goods list and get a basic list', () => {
//     const goods_contain_3_for_2 = [
//         'ITEM000001',
//         'ITEM000001',
//         'ITEM000001',
//         'ITEM000001',
//         'ITEM000001',
//         'ITEM000003-2',
//         'ITEM000005',
//         'ITEM000005',
//         'ITEM000005'
//     ]

//     const result_basic = [
//       {
//         'code': 'ITEM000001',
//         'name': '羽毛球',
//         'unit': '个',
//         'price': 1,
//         'count': 5
//       },
//       {
//         'code': 'ITEM000003',
//         'name': '苹果',
//         'unit': '斤',
//         'price': 5.5,
//         'count': 2
//       },
//       {
//         'code': 'ITEM000005',
//         'name': '可口可乐',
//         'unit': '瓶',
//         'price': 3,
//         'count': 3
//       }
//     ]
//     let basic_list = machine.process_original_list(goods_contain_3_for_2)
//     it('should return a details goods item list', () => {
//       assert.deepEqual(result_basic, basic_list)
//     })
//   })

//   describe('Get promotion code for each item in list', () => {
//     const basic_list = [
//       {
//         'code': 'ITEM000001',
//         'name': '羽毛球',
//         'unit': '个',
//         'price': 1,
//         'count': 5
//       },
//       {
//         'code': 'ITEM000003',
//         'name': '苹果',
//         'unit': '斤',
//         'price': 5.5,
//         'count': 2
//       },
//       {
//         'code': 'ITEM000005',
//         'name': '可口可乐',
//         'unit': '瓶',
//         'price': 3,
//         'count': 3
//       }
//     ]

//     const result_promotion = [
//       {
//         'code': 'ITEM000001',
//         'name': '羽毛球',
//         'unit': '个',
//         'price': 1,
//         'count': 5,
//         'promo': 'BUY_2_GET_1_FREE'
//       },
//       {
//         'code': 'ITEM000003',
//         'name': '苹果',
//         'unit': '斤',
//         'price': 5.5,
//         'count': 2,
//         'promo': '5_PERCENT_OFF'
//       },
//       {
//         'code': 'ITEM000005',
//         'name': '可口可乐',
//         'unit': '瓶',
//         'price': 3,
//         'count': 3,
//         'promo': 'BUY_2_GET_1_FREE'
//       }
//     ]

//     let promotion_list = machine.process_promotions(basic_list)
//     it('should return a list with promotion code', () => {
//       assert.deepEqual(result_promotion, promotion_list)
//     })
//   })

//   describe('Calculate savings based on purchase list', () => {
//     const promotion_list = [
//       {
//         'code': 'ITEM000001',
//         'name': '羽毛球',
//         'unit': '个',
//         'price': 1.00,
//         'count': 5,
//         'promo': 'BUY_2_GET_1_FREE'
//       },
//       {
//         'code': 'ITEM000003',
//         'name': '苹果',
//         'unit': '斤',
//         'price': 5.5,
//         'count': 2,
//         'promo': '5_PERCENT_OFF'
//       },
//       {
//         'code': 'ITEM000005',
//         'name': '可口可乐',
//         'unit': '瓶',
//         'price': 3.00,
//         'count': 3,
//         'promo': 'BUY_2_GET_1_FREE'
//       }
//     ]

//     const result_obj = {
//       'detail': [
//         {
//           'code': 'ITEM000001',
//           'name': '羽毛球',
//           'unit': '个',
//           'price': 1,
//           'count': 5,
//           'promo': 'BUY_2_GET_1_FREE',
//           'summary': 4.00,
//           'saving': 1.00
//         },
//         {
//           'code': 'ITEM000003',
//           'name': '苹果',
//           'unit': '斤',
//           'price': 5.5,
//           'count': 2,
//           'promo': '5_PERCENT_OFF',
//           'summary': 10.45,
//           'saving': 0.55
//         },
//         {
//           'code': 'ITEM000005',
//           'name': '可口可乐',
//           'unit': '瓶',
//           'price': 3,
//           'count': 3,
//           'promo': 'BUY_2_GET_1_FREE',
//           'summary': 6.00,
//           'saving': 3.00
//         }
//       ],
//       '2get1': [
//         {
//           'name': '羽毛球',
//           'count': 1,
//           'unit': '个'
//         },
//         {
//           'name': '可口可乐',
//           'count': 1,
//           'unit': '瓶'
//         }
//       ],
//       'summary': {
//         'total': 20.45,
//         'saving': 4.55
//       }
//     }
//     it('should return a gaint list', () => {
//       assert.deepEqual(result_obj, machine.process_price(promotion_list));
//       machine.generate_receipt(result_obj)
//     })
//   })
// })