export default {
  name: 'subscription',
  title: 'Subscription',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Service Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'url',
      title: 'Service URL',
      type: 'url'
    },
    {
      name: 'price',
      title: 'Monthly Price',
      type: 'number',
      validation: Rule => Rule.min(0)
    },
    {
      name: 'currency',
      title: 'Currency',
      type: 'string',
      options: {
        list: [
          { title: 'TWD', value: 'TWD' },
          { title: 'USD', value: 'USD' },
          { title: 'EUR', value: 'EUR' }
        ]
      },
      initialValue: 'TWD'
    },
    {
      name: 'nextDate',
      title: 'Next Payment Date',
      type: 'date'
    },
    {
      name: 'billingCycle',
      title: 'Billing Cycle',
      type: 'string',
      options: {
        list: [
          { title: 'Monthly', value: 'monthly' },
          { title: 'Yearly', value: 'yearly' },
          { title: 'Weekly', value: 'weekly' }
        ]
      },
      initialValue: 'monthly'
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Cancelled', value: 'cancelled' },
          { title: 'Expired', value: 'expired' },
          { title: 'Paused', value: 'paused' }
        ]
      },
      initialValue: 'active'
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: '影視娛樂', value: 'entertainment' },
          { title: '開發工具', value: 'development' },
          { title: '雲端服務', value: 'cloud' },
          { title: '學習平台', value: 'education' },
          { title: '其他', value: 'other' }
        ]
      }
    },
    {
      name: 'logo',
      title: 'Service Logo',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'note',
      title: 'Notes',
      type: 'text',
      rows: 3
    },
    {
      name: 'autoRenew',
      title: 'Auto Renew',
      type: 'boolean',
      initialValue: true
    },
    {
      name: 'paymentMethod',
      title: 'Payment Method',
      type: 'string',
      options: {
        list: [
          { title: '信用卡', value: 'credit_card' },
          { title: 'PayPal', value: 'paypal' },
          { title: '銀行轉帳', value: 'bank_transfer' },
          { title: '其他', value: 'other' }
        ]
      }
    },
    {
      name: 'startDate',
      title: 'Start Date',
      type: 'date'
    },
    {
      name: 'reminderDays',
      title: 'Reminder Days Before',
      type: 'number',
      description: '在到期前幾天提醒',
      initialValue: 7
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'price',
      media: 'logo'
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title,
        subtitle: subtitle ? `$${subtitle}/月` : '無價格資訊'
      };
    }
  }
}