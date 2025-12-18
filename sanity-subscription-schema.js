// Subscription Schema
const subscriptionSchema = {
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
      name: 'site',
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
      name: 'nextdate',
      title: 'Next Payment Date',
      type: 'date'
    },
    {
      name: 'note',
      title: 'Notes',
      type: 'text',
      rows: 3
    },
    {
      name: 'account',
      title: 'Account Info',
      type: 'string'
    }
  ]
};

// Food Schema
const foodSchema = {
  name: 'food',
  title: 'Food',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Food Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'amount',
      title: 'Amount',
      type: 'number',
      validation: Rule => Rule.min(0)
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: Rule => Rule.min(0)
    },
    {
      name: 'shop',
      title: 'Shop',
      type: 'string'
    },
    {
      name: 'todate',
      title: 'Expiry Date',
      type: 'date'
    },
    {
      name: 'photourl',
      title: 'Photo URL',
      type: 'url'
    },
    {
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'photohash',
      title: 'Photo Hash',
      type: 'string'
    }
  ]
};

export const schemaTypes = [subscriptionSchema, foodSchema];