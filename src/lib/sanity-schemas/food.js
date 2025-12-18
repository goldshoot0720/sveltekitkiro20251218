export default {
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
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'shop',
      media: 'photo'
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title,
        subtitle: subtitle ? `購於 ${subtitle}` : '無商店資訊'
      };
    }
  }
}