"use strict"

var assert = require('assert');
var machine = require('../main');

describe('Step by step test', () => {
  describe('Read the goods list and get a basic list', () => {
    const goods_contain_3_for_2 = [
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

    const result_basic = [
      {
        'code': 'ITEM000001',
        'name': '羽毛球',
        'unit': '个',
        'price': 1,
        'count': 5
      },
      {
        'code': 'ITEM000003',
        'name': '苹果',
        'unit': '斤',
        'price': 5.5,
        'count': 2
      },
      {
        'code': 'ITEM000005',
        'name': '可口可乐',
        'unit': '瓶',
        'price': 3,
        'count': 3
      }
    ]
    let basic_list = machine.process_original_list(goods_contain_3_for_2)
    it('should return a details goods item list', () => {
      assert.deepEqual(result_basic, basic_list)
    })
  })

  describe('Get promotion code for each item in list', () => {
    const basic_list = [
      {
        'code': 'ITEM000001',
        'name': '羽毛球',
        'unit': '个',
        'price': 1,
        'count': 5
      },
      {
        'code': 'ITEM000003',
        'name': '苹果',
        'unit': '斤',
        'price': 5.5,
        'count': 2
      },
      {
        'code': 'ITEM000005',
        'name': '可口可乐',
        'unit': '瓶',
        'price': 3,
        'count': 3
      }
    ]

    const result_promotion = [
      {
        'code': 'ITEM000001',
        'name': '羽毛球',
        'unit': '个',
        'price': 1,
        'count': 5,
        'promo': 'BUY_2_GET_1_FREE'
      },
      {
        'code': 'ITEM000003',
        'name': '苹果',
        'unit': '斤',
        'price': 5.5,
        'count': 2,
        'promo': '5_PERCENT_OFF'
      },
      {
        'code': 'ITEM000005',
        'name': '可口可乐',
        'unit': '瓶',
        'price': 3,
        'count': 3,
        'promo': 'BUY_2_GET_1_FREE'
      }
    ]

    let promotion_list = machine.process_promotions(basic_list)
    it('should return a list with promotion code', () => {
      assert.deepEqual(result_promotion, promotion_list)
    })
  })

  describe('Calculate savings based on purchase list', () => {
    const promotion_list = [
      {
        'code': 'ITEM000001',
        'name': '羽毛球',
        'unit': '个',
        'price': 1.00,
        'count': 5,
        'promo': 'BUY_2_GET_1_FREE'
      },
      {
        'code': 'ITEM000003',
        'name': '苹果',
        'unit': '斤',
        'price': 5.5,
        'count': 2,
        'promo': '5_PERCENT_OFF'
      },
      {
        'code': 'ITEM000005',
        'name': '可口可乐',
        'unit': '瓶',
        'price': 3.00,
        'count': 3,
        'promo': 'BUY_2_GET_1_FREE'
      }
    ]

    const result_obj = {
      'detail': [
        {
          'code': 'ITEM000001',
          'name': '羽毛球',
          'unit': '个',
          'price': 1,
          'count': 5,
          'promo': 'BUY_2_GET_1_FREE',
          'summary': 4.00,
          'saving': 1.00
        },
        {
          'code': 'ITEM000003',
          'name': '苹果',
          'unit': '斤',
          'price': 5.5,
          'count': 2,
          'promo': '5_PERCENT_OFF',
          'summary': 10.45,
          'saving': 0.55
        },
        {
          'code': 'ITEM000005',
          'name': '可口可乐',
          'unit': '瓶',
          'price': 3,
          'count': 3,
          'promo': 'BUY_2_GET_1_FREE',
          'summary': 6.00,
          'saving': 3.00
        }
      ],
      '2get1': [
        {
          'name': '羽毛球',
          'count': 1,
          'unit': '个'
        },
        {
          'name': '可口可乐',
          'count': 1,
          'unit': '瓶'
        }
      ],
      'summary': {
        'total': 20.45,
        'saving': 4.55
      }
    }
    it('should return a gaint list', () => {
      assert.deepEqual(result_obj, machine.process_price(promotion_list));
      machine.generate_receipt(result_obj)
    })
  })
})