# Asset Frontend Knowledge

Asset frontend shows platform assets and their display rules.

MVP assets:

- XAU: gold, stored internally in milligrams
- IRR: Iranian Rial, stored internally in rials

Frontend responsibilities:

- display asset labels and symbols
- display units such as mg, gram, rial, toman when allowed
- explain asset capabilities: tradable, wallet-enabled, physical-deliverable, transferable
- prevent unsupported flows from being shown as available

Do not calculate final trade quantities or precision rules independently of backend metadata.
