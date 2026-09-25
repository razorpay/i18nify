INSERT INTO rule_groups(id, public_id, rule_chain_id, namespace_id, name, description, outcome_type, strategy,
                        mandatory_attributes, additional_attributes, pre_condition, created_by, created_at, updated_at,
                        deleted_at, pre_condition_ast, rule_sequence)
VALUES (26961, 'NVUZTbCWGTglp9', 90, 28, 'basic_procurer_rule_group', NULL, NULL, 'charge_collections', NULL, NULL,
        '( ([$MERCHANT.fee_bearer] == ''platform'') &&  ([$PAYMENT.method] != ''cod'') &&  ([$PAYMENT.method] != ''transfer'') &&  ([$PAYMENT.method] != ''intl_bank_transfer'') &&  ([$TERMINAL.procurer] == ''merchant'') &&  ([$META_DATA.apply_procurer_pricing] == ''on''))',
        'Shankar Parimi', '2024-02-01 04:59:57', '2024-02-01 04:59:57', NULL,
        '{"type": "logical", "value": "&&", "operands": [{"type": "comparator", "value": "==", "operands": [{"type": "variable", "value": "$MERCHANT.fee_bearer", "operands": null}, {"type": "string", "value": "platform", "operands": null}]}, {"type": "comparator", "value": "!=", "operands": [{"type": "variable", "value": "$PAYMENT.method", "operands": null}, {"type": "string", "value": "cod", "operands": null}]}, {"type": "comparator", "value": "!=", "operands": [{"type": "variable", "value": "$PAYMENT.method", "operands": null}, {"type": "string", "value": "transfer", "operands": null}]}, {"type": "comparator", "value": "!=", "operands": [{"type": "variable", "value": "$PAYMENT.method", "operands": null}, {"type": "string", "value": "intl_bank_transfer", "operands": null}]}, {"type": "comparator", "value": "==", "operands": [{"type": "variable", "value": "$TERMINAL.procurer", "operands": null}, {"type": "string", "value": "merchant", "operands": null}]}, {"type": "comparator", "value": "==", "operands": [{"type": "variable", "value": "$META_DATA.apply_procurer_pricing", "operands": null}, {"type": "string", "value": "on", "operands": null}]}]}',
        NULL);
INSERT INTO rule_groups(id, public_id, rule_chain_id, namespace_id, name, description, outcome_type, strategy,
                        mandatory_attributes, additional_attributes, pre_condition, created_by, created_at, updated_at,
                        deleted_at, pre_condition_ast, rule_sequence)
VALUES (26962, 'NVUZTc8cN4bmjm', 90, 28, 'basic_procurer_rule_group_control', NULL, NULL, 'charge_collections', NULL,
        NULL,
        '( ([$MERCHANT.fee_bearer] == ''platform'') &&  ([$PAYMENT.method] != ''cod'') &&  ([$PAYMENT.method] != ''transfer'') &&  ([$PAYMENT.method] != ''intl_bank_transfer'') &&  ([$TERMINAL.procurer] == ''merchant'') &&  ([$META_DATA.apply_procurer_pricing] == ''control''))',
        'Shankar Parimi', '2024-02-01 04:59:57', '2024-02-01 04:59:57', NULL,
        '{"type": "logical", "value": "&&", "operands": [{"type": "comparator", "value": "==", "operands": [{"type": "variable", "value": "$MERCHANT.fee_bearer", "operands": null}, {"type": "string", "value": "platform", "operands": null}]}, {"type": "comparator", "value": "!=", "operands": [{"type": "variable", "value": "$PAYMENT.method", "operands": null}, {"type": "string", "value": "cod", "operands": null}]}, {"type": "comparator", "value": "!=", "operands": [{"type": "variable", "value": "$PAYMENT.method", "operands": null}, {"type": "string", "value": "transfer", "operands": null}]}, {"type": "comparator", "value": "!=", "operands": [{"type": "variable", "value": "$PAYMENT.method", "operands": null}, {"type": "string", "value": "intl_bank_transfer", "operands": null}]}, {"type": "comparator", "value": "==", "operands": [{"type": "variable", "value": "$TERMINAL.procurer", "operands": null}, {"type": "string", "value": "merchant", "operands": null}]}, {"type": "comparator", "value": "==", "operands": [{"type": "variable", "value": "$META_DATA.apply_procurer_pricing", "operands": null}, {"type": "string", "value": "control", "operands": null}]}]}',
        NULL);
INSERT INTO rule_groups(id, public_id, rule_chain_id, namespace_id, name, description, outcome_type, strategy,
                        mandatory_attributes, additional_attributes, pre_condition, created_by, created_at, updated_at,
                        deleted_at, pre_condition_ast, rule_sequence)
VALUES (26963, 'NVUZTcoiJO7L3W', 90, 28, 'basic_rule_group', NULL, NULL, 'charge_collections', NULL, NULL,
        '( ([$MERCHANT.fee_bearer] != ''platform'') ||  ([$TERMINAL.procurer] != ''merchant''))', 'Shankar Parimi',
        '2024-02-01 04:59:57', '2024-02-01 04:59:57', NULL,
        '{"type": "logical", "value": "||", "operands": [{"type": "comparator", "value": "!=", "operands": [{"type": "variable", "value": "$MERCHANT.fee_bearer", "operands": null}, {"type": "string", "value": "platform", "operands": null}]}, {"type": "comparator", "value": "!=", "operands": [{"type": "variable", "value": "$TERMINAL.procurer", "operands": null}, {"type": "string", "value": "merchant", "operands": null}]}]}',
        NULL);
INSERT INTO rule_groups(id, public_id, rule_chain_id, namespace_id, name, description, outcome_type, strategy,
                        mandatory_attributes, additional_attributes, pre_condition, created_by, created_at, updated_at,
                        deleted_at, pre_condition_ast, rule_sequence)
VALUES (26964, 'NVUZTibKXOZnUy', 91, 28, 'relevant_rule_procurer', NULL, NULL, 'charge_collections', NULL, NULL,
        '( ([$MERCHANT.fee_bearer] == ''platform'') &&  ([$PAYMENT.method] != ''cod'') &&  ([$PAYMENT.method] != ''transfer'') &&  ([$PAYMENT.method] != ''intl_bank_transfer''))',
        'Shankar Parimi', '2024-02-01 04:59:58', '2024-02-01 04:59:58', NULL,
        '{"type": "logical", "value": "&&", "operands": [{"type": "comparator", "value": "==", "operands": [{"type": "variable", "value": "$MERCHANT.fee_bearer", "operands": null}, {"type": "string", "value": "platform", "operands": null}]}, {"type": "comparator", "value": "!=", "operands": [{"type": "variable", "value": "$PAYMENT.method", "operands": null}, {"type": "string", "value": "cod", "operands": null}]}, {"type": "comparator", "value": "!=", "operands": [{"type": "variable", "value": "$PAYMENT.method", "operands": null}, {"type": "string", "value": "transfer", "operands": null}]}, {"type": "comparator", "value": "!=", "operands": [{"type": "variable", "value": "$PAYMENT.method", "operands": null}, {"type": "string", "value": "intl_bank_transfer", "operands": null}]}]}',
        NULL);
INSERT INTO rule_groups(id, public_id, rule_chain_id, namespace_id, name, description, outcome_type, strategy,
                        mandatory_attributes, additional_attributes, pre_condition, created_by, created_at, updated_at,
                        deleted_at, pre_condition_ast, rule_sequence)
VALUES (26965, 'NVUZTjGigSwCI6', 91, 28, 'source_channel_group', NULL, NULL, 'charge_collections', NULL, NULL, NULL,
        'Shankar Parimi', '2024-02-01 04:59:58', '2024-02-01 04:59:58', NULL, NULL, NULL);
INSERT INTO rule_groups(id, public_id, rule_chain_id, namespace_id, name, description, outcome_type, strategy,
                        mandatory_attributes, additional_attributes, pre_condition, created_by, created_at, updated_at,
                        deleted_at, pre_condition_ast, rule_sequence)
VALUES (26966, 'NVUZTjqJ2dEBGk', 91, 28, 'upi_method_group', NULL, NULL, 'charge_collections', NULL, NULL, NULL,
        'Shankar Parimi', '2024-02-01 04:59:58', '2024-02-01 04:59:58', NULL, NULL, NULL);
INSERT INTO rule_groups(id, public_id, rule_chain_id, namespace_id, name, description, outcome_type, strategy,
                        mandatory_attributes, additional_attributes, pre_condition, created_by, created_at, updated_at,
                        deleted_at, pre_condition_ast, rule_sequence)
VALUES (26967, 'NVUZTkLKORxsXp', 91, 28, 'amount_range_group', NULL, NULL, 'charge_collections', NULL, NULL, NULL,
        'Shankar Parimi', '2024-02-01 04:59:58', '2024-02-01 04:59:58', NULL, NULL, NULL);
INSERT INTO rule_groups(id, public_id, rule_chain_id, namespace_id, name, description, outcome_type, strategy,
                        mandatory_attributes, additional_attributes, pre_condition, created_by, created_at, updated_at,
                        deleted_at, pre_condition_ast, rule_sequence)
VALUES (26968, 'NVUZTkp8wcmjJx', 91, 28, 'amount_select_group', NULL, NULL, 'charge_collections', NULL, NULL,
        '([$PRICING_RULES.amount_range_active] == true)', 'Shankar Parimi', '2024-02-01 04:59:58', '2024-02-01 04:59:58',
        NULL,
        '{"type": "comparator", "value": "==", "operands": [{"type": "variable", "value": "$PRICING_RULES.amount_range_active", "operands": null}, {"type": "boolean", "value": "true", "operands": null}]}',
        NULL);
INSERT INTO rule_groups(id, public_id, rule_chain_id, namespace_id, name, description, outcome_type, strategy,
                        mandatory_attributes, additional_attributes, pre_condition, created_by, created_at, updated_at,
                        deleted_at, pre_condition_ast, rule_sequence)
VALUES (26969, 'NVUZTtAleZ40Lz', 92, 28, 'addon_group', NULL, NULL, 'charge_collections', NULL, NULL, NULL,
        'Shankar Parimi', '2024-02-01 04:59:58', '2024-02-01 04:59:58', NULL, NULL, NULL);
INSERT INTO rule_groups(id, public_id, rule_chain_id, namespace_id, name, description, outcome_type, strategy,
                        mandatory_attributes, additional_attributes, pre_condition, created_by, created_at, updated_at,
                        deleted_at, pre_condition_ast, rule_sequence)
VALUES (26970, 'NVUZTu62eFA36C', 92, 28, 'addon_group_method', NULL, NULL, 'charge_collections', NULL, NULL,
        '([$PRICING_RULES.feature] == [$PAYMENT.feature])', 'Shankar Parimi', '2024-02-01 04:59:58', '2024-02-01 04:59:58',
        NULL,
        '{"type": "comparator", "value": "==", "operands": [{"type": "variable", "value": "$PRICING_RULES.feature", "operands": null}, {"type": "variable", "value": "$PAYMENT.feature", "operands": null}]}',
        NULL);
INSERT INTO rule_groups(id, public_id, rule_chain_id, namespace_id, name, description, outcome_type, strategy,
                        mandatory_attributes, additional_attributes, pre_condition, created_by, created_at, updated_at,
                        deleted_at, pre_condition_ast, rule_sequence)
VALUES (26971, 'NVUZU2JE8DbCYF', 93, 28, 'relevant_rule_procurer', NULL, NULL, 'charge_collections', NULL, NULL,
        '( ([$MERCHANT.fee_bearer] == ''platform'') &&  ([$PAYMENT.method] != ''cod'') &&  ([$PAYMENT.method] != ''transfer'') &&  ([$PAYMENT.method] != ''intl_bank_transfer''))',
        'Shankar Parimi', '2024-02-01 04:59:58', '2024-02-01 04:59:58', NULL,
        '{"type": "logical", "value": "&&", "operands": [{"type": "comparator", "value": "==", "operands": [{"type": "variable", "value": "$MERCHANT.fee_bearer", "operands": null}, {"type": "string", "value": "platform", "operands": null}]}, {"type": "comparator", "value": "!=", "operands": [{"type": "variable", "value": "$PAYMENT.method", "operands": null}, {"type": "string", "value": "cod", "operands": null}]}, {"type": "comparator", "value": "!=", "operands": [{"type": "variable", "value": "$PAYMENT.method", "operands": null}, {"type": "string", "value": "transfer", "operands": null}]}, {"type": "comparator", "value": "!=", "operands": [{"type": "variable", "value": "$PAYMENT.method", "operands": null}, {"type": "string", "value": "intl_bank_transfer", "operands": null}]}]}',
        NULL);
INSERT INTO rule_groups(id, public_id, rule_chain_id, namespace_id, name, description, outcome_type, strategy,
                        mandatory_attributes, additional_attributes, pre_condition, created_by, created_at, updated_at,
                        deleted_at, pre_condition_ast, rule_sequence)
VALUES (26972, 'NVUZU3ZMF7k9gp', 93, 28, 'source_channel_group', NULL, NULL, 'charge_collections', NULL, NULL, NULL,
        'Shankar Parimi', '2024-02-01 04:59:58', '2024-02-01 04:59:58', NULL, NULL, NULL);
INSERT INTO rule_groups(id, public_id, rule_chain_id, namespace_id, name, description, outcome_type, strategy,
                        mandatory_attributes, additional_attributes, pre_condition, created_by, created_at, updated_at,
                        deleted_at, pre_condition_ast, rule_sequence)
VALUES (26973, 'NVUZU5DNuVMq19', 93, 28, 'card_sodexo_group', NULL, NULL, 'charge_collections', NULL, NULL,
        '( ([$PAYMENT.method] == ''card'') &&  ([$PAYMENT.provider] == ''sodexo''))', 'Shankar Parimi',
        '2024-02-01 04:59:58', '2024-02-01 04:59:58', NULL,
        '{"type": "logical", "value": "&&", "operands": [{"type": "comparator", "value": "==", "operands": [{"type": "variable", "value": "$PAYMENT.method", "operands": null}, {"type": "string", "value": "card", "operands": null}]}, {"type": "comparator", "value": "==", "operands": [{"type": "variable", "value": "$PAYMENT.provider", "operands": null}, {"type": "string", "value": "sodexo", "operands": null}]}]}',
        NULL);
INSERT INTO rule_groups(id, public_id, rule_chain_id, namespace_id, name, description, outcome_type, strategy,
                        mandatory_attributes, additional_attributes, pre_condition, created_by, created_at, updated_at,
                        deleted_at, pre_condition_ast, rule_sequence)
VALUES (26974, 'NVUZU6WfrMc6Ty', 93, 28, 'card_sodexo_auth_group', NULL, NULL, 'charge_collections', NULL, NULL,
        '( ([$PAYMENT.method] == ''card'') &&  ([$PAYMENT.provider] == ''sodexo''))', 'Shankar Parimi',
        '2024-02-01 04:59:58', '2024-02-01 04:59:58', NULL,
        '{"type": "logical", "value": "&&", "operands": [{"type": "comparator", "value": "==", "operands": [{"type": "variable", "value": "$PAYMENT.method", "operands": null}, {"type": "string", "value": "card", "operands": null}]}, {"type": "comparator", "value": "==", "operands": [{"type": "variable", "value": "$PAYMENT.provider", "operands": null}, {"type": "string", "value": "sodexo", "operands": null}]}]}',
        NULL);
INSERT INTO rule_groups(id, public_id, rule_chain_id, namespace_id, name, description, outcome_type, strategy,
                        mandatory_attributes, additional_attributes, pre_condition, created_by, created_at, updated_at,
                        deleted_at, pre_condition_ast, rule_sequence)
VALUES (26975, 'NVUZU7NqDricpC', 93, 28, 'amount_range_group', NULL, NULL, 'charge_collections', NULL, NULL, NULL,
        'Shankar Parimi', '2024-02-01 04:59:58', '2024-02-01 04:59:58', NULL, NULL, NULL);
INSERT INTO rule_groups(id, public_id, rule_chain_id, namespace_id, name, description, outcome_type, strategy,
                        mandatory_attributes, additional_attributes, pre_condition, created_by, created_at, updated_at,
                        deleted_at, pre_condition_ast, rule_sequence)
VALUES (26976, 'NVUZU8X9WgbsKt', 93, 28, 'amount_select_group', NULL, NULL, 'charge_collections', NULL, NULL,
        '([$PRICING_RULES.amount_range_active] == true)', 'Shankar Parimi', '2024-02-01 04:59:58', '2024-02-01 04:59:58',
        NULL,
        '{"type": "comparator", "value": "==", "operands": [{"type": "variable", "value": "$PRICING_RULES.amount_range_active", "operands": null}, {"type": "boolean", "value": "true", "operands": null}]}',
        NULL);
INSERT INTO rule_groups(id, public_id, rule_chain_id, namespace_id, name, description, outcome_type, strategy,
                        mandatory_attributes, additional_attributes, pre_condition, created_by, created_at, updated_at,
                        deleted_at, pre_condition_ast, rule_sequence)
VALUES (26977, 'NVUZUH9cYIjamc', 94, 28, 'relevant_rule_procurer', NULL, NULL, 'charge_collections', NULL, NULL,
        '( ([$MERCHANT.fee_bearer] == ''platform'') &&  ([$PAYMENT.method] != ''cod'') &&  ([$PAYMENT.method] != ''transfer'') &&  ([$PAYMENT.method] != ''intl_bank_transfer''))',
        'Shankar Parimi', '2024-02-01 04:59:58', '2024-02-01 04:59:58', NULL,
        '{"type": "logical", "value": "&&", "operands": [{"type": "comparator", "value": "==", "operands": [{"type": "variable", "value": "$MERCHANT.fee_bearer", "operands": null}, {"type": "string", "value": "platform", "operands": null}]}, {"type": "comparator", "value": "!=", "operands": [{"type": "variable", "value": "$PAYMENT.method", "operands": null}, {"type": "string", "value": "cod", "operands": null}]}, {"type": "comparator", "value": "!=", "operands": [{"type": "variable", "value": "$PAYMENT.method", "operands": null}, {"type": "string", "value": "transfer", "operands": null}]}, {"type": "comparator", "value": "!=", "operands": [{"type": "variable", "value": "$PAYMENT.method", "operands": null}, {"type": "string", "value": "intl_bank_transfer", "operands": null}]}]}',
        NULL);
INSERT INTO rule_groups(id, public_id, rule_chain_id, namespace_id, name, description, outcome_type, strategy,
                        mandatory_attributes, additional_attributes, pre_condition, created_by, created_at, updated_at,
                        deleted_at, pre_condition_ast, rule_sequence)
VALUES (26978, 'NVUZUHw3AwmTsM', 94, 28, 'source_channel_group', NULL, NULL, 'charge_collections', NULL, NULL, NULL,
        'Shankar Parimi', '2024-02-01 04:59:58', '2024-02-01 04:59:58', NULL, NULL, NULL);
INSERT INTO rule_groups(id, public_id, rule_chain_id, namespace_id, name, description, outcome_type, strategy,
                        mandatory_attributes, additional_attributes, pre_condition, created_by, created_at, updated_at,
                        deleted_at, pre_condition_ast, rule_sequence)
VALUES (26979, 'NVUZUIW0y3OxS4', 94, 28, 'card_amex_group', NULL, NULL, 'charge_collections', NULL, NULL,
        '([$CARD.network] == ''AMEX'')', 'Shankar Parimi', '2024-02-01 04:59:58', '2024-02-01 04:59:58', NULL,
        '{"type": "comparator", "value": "==", "operands": [{"type": "variable", "value": "$CARD.network", "operands": null}, {"type": "string", "value": "AMEX", "operands": null}]}',
        NULL);
INSERT INTO rule_groups(id, public_id, rule_chain_id, namespace_id, name, description, outcome_type, strategy,
                        mandatory_attributes, additional_attributes, pre_condition, created_by, created_at, updated_at,
                        deleted_at, pre_condition_ast, rule_sequence)
VALUES (26980, 'NVUZUJ8MnhXyZX', 94, 28, 'card_amex_network_group', NULL, NULL, 'charge_collections', NULL, NULL,
        '([$CARD.network] == ''AMEX'')', 'Shankar Parimi', '2024-02-01 04:59:58', '2024-02-01 04:59:58', NULL,
        '{"type": "comparator", "value": "==", "operands": [{"type": "variable", "value": "$CARD.network", "operands": null}, {"type": "string", "value": "AMEX", "operands": null}]}',
        NULL);
INSERT INTO rule_groups(id, public_id, rule_chain_id, namespace_id, name, description, outcome_type, strategy,
                        mandatory_attributes, additional_attributes, pre_condition, created_by, created_at, updated_at,
                        deleted_at, pre_condition_ast, rule_sequence)
VALUES (26981, 'NVUZUPKiWGiQiC', 95, 28, 'relevant_rule_procurer', NULL, NULL, 'charge_collections', NULL, NULL,
        '( ([$MERCHANT.fee_bearer] == ''platform'') &&  ([$PAYMENT.method] != ''cod'') &&  ([$PAYMENT.method] != ''transfer'') &&  ([$PAYMENT.method] != ''intl_bank_transfer''))',
        'Shankar Parimi', '2024-02-01 04:59:58', '2024-02-01 04:59:58', NULL,
        '{"type": "logical", "value": "&&", "operands": [{"type": "comparator", "value": "==", "operands": [{"type": "variable", "value": "$MERCHANT.fee_bearer", "operands": null}, {"type": "string", "value": "platform", "operands": null}]}, {"type": "comparator", "value": "!=", "operands": [{"type": "variable", "value": "$PAYMENT.method", "operands": null}, {"type": "string", "value": "cod", "operands": null}]}, {"type": "comparator", "value": "!=", "operands": [{"type": "variable", "value": "$PAYMENT.method", "operands": null}, {"type": "string", "value": "transfer", "operands": null}]}, {"type": "comparator", "value": "!=", "operands": [{"type": "variable", "value": "$PAYMENT.method", "operands": null}, {"type": "string", "value": "intl_bank_transfer", "operands": null}]}]}',
        NULL);
INSERT INTO rule_groups(id, public_id, rule_chain_id, namespace_id, name, description, outcome_type, strategy,
                        mandatory_attributes, additional_attributes, pre_condition, created_by, created_at, updated_at,
                        deleted_at, pre_condition_ast, rule_sequence)
VALUES (26982, 'NVUZUQH1LjaK9d', 95, 28, 'source_channel_group', NULL, NULL, 'charge_collections', NULL, NULL, NULL,
        'Shankar Parimi', '2024-02-01 04:59:58', '2024-02-01 04:59:58', NULL, NULL, NULL);
INSERT INTO rule_groups(id, public_id, rule_chain_id, namespace_id, name, description, outcome_type, strategy,
                        mandatory_attributes, additional_attributes, pre_condition, created_by, created_at, updated_at,
                        deleted_at, pre_condition_ast, rule_sequence)
VALUES (26983, 'NVUZURe9D9QKzS', 95, 28, 'card_group', NULL, NULL, 'charge_collections', NULL, NULL, NULL,
        'Shankar Parimi', '2024-02-01 04:59:58', '2024-02-01 04:59:58', NULL, NULL, NULL);
INSERT INTO rule_groups(id, public_id, rule_chain_id, namespace_id, name, description, outcome_type, strategy,
                        mandatory_attributes, additional_attributes, pre_condition, created_by, created_at, updated_at,
                        deleted_at, pre_condition_ast, rule_sequence)
VALUES (26984, 'NVUZUShlWjZNI9', 95, 28, 'card_corporate_group', NULL, NULL, 'charge_collections', NULL, NULL,
        '( ([$CARD.sub_type] == ''business'') &&  ([$MERCHANT.org_id] == ''100000razorpay''))', 'Shankar Parimi',
        '2024-02-01 04:59:58', '2024-02-01 04:59:58', NULL,
        '{"type": "logical", "value": "&&", "operands": [{"type": "comparator", "value": "==", "operands": [{"type": "variable", "value": "$CARD.sub_type", "operands": null}, {"type": "string", "value": "business", "operands": null}]}, {"type": "comparator", "value": "==", "operands": [{"type": "variable", "value": "$MERCHANT.org_id", "operands": null}, {"type": "string", "value": "100000razorpay", "operands": null}]}]}',
        NULL);
INSERT INTO rule_groups(id, public_id, rule_chain_id, namespace_id, name, description, outcome_type, strategy,
                        mandatory_attributes, additional_attributes, pre_condition, created_by, created_at, updated_at,
                        deleted_at, pre_condition_ast, rule_sequence)
VALUES (26985, 'NVUZUTSxd5BeMQ', 95, 28, 'card_network_group', NULL, NULL, 'charge_collections', NULL, NULL, NULL,
        'Shankar Parimi', '2024-02-01 04:59:58', '2024-02-01 04:59:58', NULL, NULL, NULL);
INSERT INTO rule_groups(id, public_id, rule_chain_id, namespace_id, name, description, outcome_type, strategy,
                        mandatory_attributes, additional_attributes, pre_condition, created_by, created_at, updated_at,
                        deleted_at, pre_condition_ast, rule_sequence)
VALUES (26986, 'NVUZUUEW2pFY1i', 95, 28, 'card_non_corp_prepaid_method_type_group', NULL, NULL, 'charge_collections',
        NULL, NULL,
        '( ( ([$CARD.sub_type] != ''business'') ||  ([$MERCHANT.org_id] != ''100000razorpay'')) &&  ([$CARD.card_type] == ''prepaid''))',
        'Shankar Parimi', '2024-02-01 04:59:58', '2024-02-01 04:59:58', NULL,
        '{"type": "logical", "value": "&&", "operands": [{"type": "logical", "value": "||", "operands": [{"type": "comparator", "value": "!=", "operands": [{"type": "variable", "value": "$CARD.sub_type", "operands": null}, {"type": "string", "value": "business", "operands": null}]}, {"type": "comparator", "value": "!=", "operands": [{"type": "variable", "value": "$MERCHANT.org_id", "operands": null}, {"type": "string", "value": "100000razorpay", "operands": null}]}]}, {"type": "comparator", "value": "==", "operands": [{"type": "variable", "value": "$CARD.card_type", "operands": null}, {"type": "string", "value": "prepaid", "operands": null}]}]}',
        NULL);
INSERT INTO rule_groups(id, public_id, rule_chain_id, namespace_id, name, description, outcome_type, strategy,
                        mandatory_attributes, additional_attributes, pre_condition, created_by, created_at, updated_at,
                        deleted_at, pre_condition_ast, rule_sequence)
VALUES (26987, 'NVUZUcTJIUbYk7', 96, 28, 'card_method_type_group', NULL, NULL, 'charge_collections', NULL, NULL, NULL,
        'Shankar Parimi', '2024-02-01 04:59:58', '2024-02-01 04:59:58', NULL, NULL, NULL);
INSERT INTO rule_groups(id, public_id, rule_chain_id, namespace_id, name, description, outcome_type, strategy,
                        mandatory_attributes, additional_attributes, pre_condition, created_by, created_at, updated_at,
                        deleted_at, pre_condition_ast, rule_sequence)
VALUES (26988, 'NVUZUdCgPHTRRr', 96, 28, 'card_method_sub_type_group', NULL, NULL, 'charge_collections', NULL, NULL,
        NULL, 'Shankar Parimi', '2024-02-01 04:59:58', '2024-02-01 04:59:58', NULL, NULL, NULL);
INSERT INTO rule_groups(id, public_id, rule_chain_id, namespace_id, name, description, outcome_type, strategy,
                        mandatory_attributes, additional_attributes, pre_condition, created_by, created_at, updated_at,
                        deleted_at, pre_condition_ast, rule_sequence)
VALUES (26989, 'NVUZUdyLvPVGnH', 96, 28, 'card_auth_type_group', NULL, NULL, 'charge_collections', NULL, NULL, NULL,
        'Shankar Parimi', '2024-02-01 04:59:58', '2024-02-01 04:59:58', NULL, NULL, NULL);
INSERT INTO rule_groups(id, public_id, rule_chain_id, namespace_id, name, description, outcome_type, strategy,
                        mandatory_attributes, additional_attributes, pre_condition, created_by, created_at, updated_at,
                        deleted_at, pre_condition_ast, rule_sequence)
VALUES (26990, 'NVUZUefhX71eqD', 96, 28, 'card_payment_issuer_group', NULL, NULL, 'charge_collections', NULL, NULL,
        NULL, 'Shankar Parimi', '2024-02-01 04:59:58', '2024-02-01 04:59:58', NULL, NULL, NULL);
INSERT INTO rule_groups(id, public_id, rule_chain_id, namespace_id, name, description, outcome_type, strategy,
                        mandatory_attributes, additional_attributes, pre_condition, created_by, created_at, updated_at,
                        deleted_at, pre_condition_ast, rule_sequence)
VALUES (26991, 'NVUZUfQ2Wi0ibN', 96, 28, 'amount_range_group', NULL, NULL, 'charge_collections', NULL, NULL, NULL,
        'Shankar Parimi', '2024-02-01 04:59:58', '2024-02-01 04:59:58', NULL, NULL, NULL);
INSERT INTO rule_groups(id, public_id, rule_chain_id, namespace_id, name, description, outcome_type, strategy,
                        mandatory_attributes, additional_attributes, pre_condition, created_by, created_at, updated_at,
                        deleted_at, pre_condition_ast, rule_sequence)
VALUES (26992, 'NVUZUg6M3TCeLH', 96, 28, 'amount_select_group', NULL, NULL, 'charge_collections', NULL, NULL,
        '([$PRICING_RULES.amount_range_active] == true)', 'Shankar Parimi', '2024-02-01 04:59:58', '2024-02-01 04:59:58',
        NULL,
        '{"type": "comparator", "value": "==", "operands": [{"type": "variable", "value": "$PRICING_RULES.amount_range_active", "operands": null}, {"type": "boolean", "value": "true", "operands": null}]}',
        NULL);
INSERT INTO rule_groups(id, public_id, rule_chain_id, namespace_id, name, description, outcome_type, strategy,
                        mandatory_attributes, additional_attributes, pre_condition, created_by, created_at, updated_at,
                        deleted_at, pre_condition_ast, rule_sequence)
VALUES (26993, 'NVUZUo8AWM4ECU', 97, 28, 'fee_bearer_group', NULL, NULL, 'charge_collections', NULL, NULL,
        '([$MERCHANT.fee_bearer] != ''dynamic'')', 'Shankar Parimi', '2024-02-01 04:59:59', '2024-02-01 04:59:59', NULL,
        '{"type": "comparator", "value": "!=", "operands": [{"type": "variable", "value": "$MERCHANT.fee_bearer", "operands": null}, {"type": "string", "value": "dynamic", "operands": null}]}',
        NULL);
