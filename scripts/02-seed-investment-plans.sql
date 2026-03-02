-- Seed investment plans table with Basic, Premium, and VIP tiers

INSERT INTO investment_plans (name, description, minimum_amount, maximum_amount, daily_return_rate, maturity_days, is_active)
VALUES
  (
    'Basic Plan',
    'Perfect for beginners. Invest between KES 1,000 - KES 50,000 and earn 5% daily returns for 30 days.',
    1000.00,
    50000.00,
    5.00,
    30,
    TRUE
  ),
  (
    'Premium Plan',
    'For experienced investors. Invest between KES 50,001 - KES 500,000 and earn 10% daily returns for 30 days.',
    50001.00,
    500000.00,
    10.00,
    30,
    TRUE
  ),
  (
    'VIP Plan',
    'Exclusive for high-value investors. Invest KES 500,001+ and earn 15% daily returns for 30 days.',
    500001.00,
    NULL,
    15.00,
    30,
    TRUE
  );
