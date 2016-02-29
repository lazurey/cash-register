"use strict"

var assert = require('assert');
var CashRegister = require('../CashRegister');

describe('Step by step test', () => {
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

  describe('Read the goods list and get a basic list', () => {
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
    it('should return a details goods item list', () => {
      let machine = new CashRegister(goods_list)
      machine.process_original_list()
      assert.deepEqual(result_basic, machine.list)
    })
  })

  describe('Get promotion code for each item in list', () => {
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

    it('should return a list with promotion code', () => {
      let machine = new CashRegister(goods_list)
      machine.process_original_list().process_promotions()
      assert.deepEqual(result_promotion, machine.list)
    })
  })

  describe('Calculate savings based on purchase list', () => {
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
      let machine = new CashRegister(goods_list)
      machine.process_original_list().process_promotions().process_price()
      assert.deepEqual(result_obj, machine.final_list);
    })
  })
})