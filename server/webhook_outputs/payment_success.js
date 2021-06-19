Payment succeeded  {
  id: 'pi_1J3p0kBIw7vu8az95WFDuf5M',
  object: 'payment_intent',
  amount: 10100,
  amount_capturable: 0,
  amount_received: 10100,
  application: null,
  application_fee_amount: null,
  canceled_at: null,
  cancellation_reason: null,
  capture_method: 'automatic',
  charges: {
    object: 'list',
    data: [ [Object] ],
    has_more: false,
    total_count: 1,
    url: '/v1/charges?payment_intent=pi_1J3p0kBIw7vu8az95WFDuf5M'
  },
  client_secret: 'pi_1J3p0kBIw7vu8az95WFDuf5M_secret_kC4gJ8zYAzF9qepS2ARGJ1Rwj',
  confirmation_method: 'automatic',
  created: 1624050838,
  currency: 'usd',
  customer: null,
  description: 'payment intent for nomad shop',
  invoice: null,
  last_payment_error: null,
  livemode: false,
  metadata: {},
  next_action: null,
  on_behalf_of: null,
  payment_method: 'pm_1J3p0tBIw7vu8az9jzHJs3WQ',
  payment_method_options: {
    card: {
      installments: null,
      network: null,
      request_three_d_secure: 'automatic'
    }
  },
  payment_method_types: [ 'card' ],
  receipt_email: 'kevin.g.grimm1@gmail.com',
  review: null,
  setup_future_usage: null,
  shipping: {
    address: {
      city: null,
      country: null,
      line1: '166 Webster Avenue',
      line2: null,
      postal_code: null,
      state: null
    },
    carrier: null,
    name: 'Kevin Grimm',
    phone: null,
    tracking_number: null
  },
  source: null,
  statement_descriptor: null,
  statement_descriptor_suffix: null,
  status: 'succeeded',
  transfer_data: null,
  transfer_group: null
}