// ⚠️ FILE TỰ ĐỘNG SINH — KHÔNG SỬA TAY.
// Nguồn: data/App QL TĐ - Sản Phẩm.csv  |  Sinh lại: npm run generate:mock
// Tổng 309 sản phẩm (154 có ảnh). Fallback khi chưa có Google Sheets API.
import type { Product } from '../types/product';

export const mockProducts: Product[] = [
  {
    "id": "T168",
    "slug": "nathalia-dress-t168",
    "name": "Nathalia Dress",
    "brand": "Sò Vintage",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 390000,
    "depositPrice": 2000000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_nathalia.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_nathalia.jpg"
    ]
  },
  {
    "id": "T027",
    "slug": "acelia-dress-s-trang-t027",
    "name": "Acelia Dress S Trắng",
    "brand": "Sò Vintage",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 350000,
    "depositPrice": 1500000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_acelia.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_acelia.jpg"
    ]
  },
  {
    "id": "T182",
    "slug": "acelia-dress-trang-l-t182",
    "name": "Acelia dress trắng L",
    "brand": "Sò Vintage",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 350000,
    "depositPrice": 1500000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_acelia.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_acelia.jpg"
    ]
  },
  {
    "id": "T167",
    "slug": "dasha-dress-t167",
    "name": "Dasha Dress",
    "brand": "Sò Vintage",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 320000,
    "depositPrice": 1400000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_dasha.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_dasha.jpg"
    ]
  },
  {
    "id": "T202",
    "slug": "hera-dress-t202",
    "name": "Hera Dress",
    "brand": "Sò Vintage",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 320000,
    "depositPrice": 1500000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_hera_S.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_hera_S.jpg"
    ]
  },
  {
    "id": "T161",
    "slug": "joseline-dress-t161",
    "name": "Joseline dress",
    "brand": "Sò Vintage",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 300000,
    "depositPrice": 1000000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_joseline.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_joseline.jpg"
    ]
  },
  {
    "id": "T149",
    "slug": "elodie-dress-l-t149",
    "name": "Elodie dress L",
    "brand": "Sò Vintage",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 280000,
    "depositPrice": 1000000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_elodi.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_elodi.jpg"
    ]
  },
  {
    "id": "T171",
    "slug": "elodie-dress-s-t171",
    "name": "Elodie Dress S",
    "brand": "Sò Vintage",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 280000,
    "depositPrice": 1400000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_elodi.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_elodi.jpg"
    ]
  },
  {
    "id": "T030",
    "slug": "joss-dress-t030",
    "name": "Joss Dress",
    "brand": "Onomade",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 280000,
    "depositPrice": 600000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_joss.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_joss.jpg"
    ]
  },
  {
    "id": "T193",
    "slug": "lilla-dress-t193",
    "name": "Lilla Dress",
    "brand": "Tiela",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 280000,
    "depositPrice": 1000000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_lilla.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_lilla.jpg"
    ]
  },
  {
    "id": "T098",
    "slug": "velia-dress-den-l-t098",
    "name": "Velia dress đen L",
    "brand": "Sò Vintage",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 280000,
    "depositPrice": 800000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_velia_den.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_velia_den.jpg"
    ]
  },
  {
    "id": "T117",
    "slug": "velia-dress-trang-l-t117",
    "name": "Velia dress trắng L",
    "brand": "Sò Vintage",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 280000,
    "depositPrice": 800000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_velia_trang.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_velia_trang.jpg"
    ]
  },
  {
    "id": "T160",
    "slug": "lena-dress-t160",
    "name": "Lena dress",
    "brand": "Sò Vintage",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 270000,
    "depositPrice": 800000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_lena.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_lena.jpg"
    ]
  },
  {
    "id": "T184",
    "slug": "luciana-dress-t184",
    "name": "Luciana Dress",
    "brand": "Sò Vintage",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 270000,
    "depositPrice": 1000000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_luciana.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_luciana.jpg"
    ]
  },
  {
    "id": "T079",
    "slug": "veletta-dress-t079",
    "name": "Veletta dress",
    "brand": "Sò Vintage",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 270000,
    "depositPrice": 1000000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_veletta.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_veletta.jpg"
    ]
  },
  {
    "id": "T180",
    "slug": "veliana-dress-t180",
    "name": "Veliana Dress",
    "brand": "Sò Vintage",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 270000,
    "depositPrice": 1000000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_veliana.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_veliana.jpg"
    ]
  },
  {
    "id": "T189",
    "slug": "felami-dress-t189",
    "name": "Felami Dress",
    "brand": "Sò Vintage",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 260000,
    "depositPrice": 1000000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_felami.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_felami.jpg"
    ]
  },
  {
    "id": "T196",
    "slug": "amara-dress-t196",
    "name": "Amara Dress",
    "brand": "Tiela",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 250000,
    "depositPrice": 700000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_amara%20(2).jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_amara%20(2).jpg",
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_amara.jpg"
    ]
  },
  {
    "id": "T101",
    "slug": "indy-dress-l-den-t101",
    "name": "Indy dress L (đen)",
    "brand": "Sò Vintage",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 250000,
    "depositPrice": 600000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_indy_den.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_indy_den.jpg"
    ]
  },
  {
    "id": "T146",
    "slug": "indy-dress-l-trang-t146",
    "name": "Indy dress L (trắng)",
    "brand": "Sò Vintage",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 250000,
    "depositPrice": 600000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_indy_trang.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_indy_trang.jpg"
    ]
  },
  {
    "id": "T198",
    "slug": "indy-dress-l-trang-2-t198",
    "name": "Indy Dress L Trắng 2",
    "brand": "Sò Vintage",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 250000,
    "depositPrice": 800000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_indy_trang.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_indy_trang.jpg"
    ]
  },
  {
    "id": "T025",
    "slug": "indy-dress-s-trang-t025",
    "name": "Indy Dress S (trắng)",
    "brand": "Sò Vintage",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 250000,
    "depositPrice": 600000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_indy_trang.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_indy_trang.jpg"
    ]
  },
  {
    "id": "T017",
    "slug": "jade-dress-t017",
    "name": "Jade Dress",
    "brand": "Sò Vintage",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 250000,
    "depositPrice": 600000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_jade.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_jade.jpg"
    ]
  },
  {
    "id": "T042",
    "slug": "jessie-long-dress-t042",
    "name": "Jessie Long Dress",
    "brand": "Trioji",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 250000,
    "depositPrice": 400000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_jessi_long.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_jessi_long.jpg"
    ]
  },
  {
    "id": "T153",
    "slug": "lina-dress-t153",
    "name": "Lina dress",
    "brand": "H.I.U Room",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 250000,
    "depositPrice": 800000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_lina.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_lina.jpg"
    ]
  },
  {
    "id": "T028",
    "slug": "malina-dress-t028",
    "name": "Malina Dress",
    "brand": "Sò Vintage",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 250000,
    "depositPrice": 600000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_malina.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_malina.jpg"
    ]
  },
  {
    "id": "T037",
    "slug": "matcha-dress-t037",
    "name": "Matcha Dress",
    "brand": "Sò Vintage",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 250000,
    "depositPrice": 600000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_matcha.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_matcha.jpg"
    ]
  },
  {
    "id": "T187",
    "slug": "molly-dress-l-t187",
    "name": "Molly Dress L",
    "brand": "Jolie Loft",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 250000,
    "depositPrice": 800000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_molly.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_molly.jpg",
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay-thiet_ke_molly%203.jpg"
    ]
  },
  {
    "id": "T176",
    "slug": "molly-dress-m-t176",
    "name": "Molly Dress M",
    "brand": "Jolie Loft",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 250000,
    "depositPrice": 800000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_molly.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_molly.jpg",
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay-thiet_ke_molly%203.jpg"
    ]
  },
  {
    "id": "T178",
    "slug": "perla-dress-t178",
    "name": "Perla Dress",
    "brand": "Flane",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 250000,
    "depositPrice": 800000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_perla.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_perla.jpg"
    ]
  },
  {
    "id": "T172",
    "slug": "celas-dress-t172",
    "name": "Celas Dress",
    "brand": "Those Studios",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 240000,
    "depositPrice": 700000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_celas.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_celas.jpg"
    ]
  },
  {
    "id": "T112",
    "slug": "clover-dress-t112",
    "name": "Clover dress",
    "brand": "Sò Vintage",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 240000,
    "depositPrice": 600000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_clover.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_clover.jpg"
    ]
  },
  {
    "id": "T102",
    "slug": "kate-dress-t102",
    "name": "Kate dress",
    "brand": "Sò Vintage",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 240000,
    "depositPrice": 600000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_kate.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_kate.jpg"
    ]
  },
  {
    "id": "T057",
    "slug": "serena-dress-m-t057",
    "name": "Serena Dress M",
    "brand": "Those Studios",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 240000,
    "depositPrice": 700000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_serena.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_serena.jpg"
    ]
  },
  {
    "id": "T002",
    "slug": "serena-dress-s-t002",
    "name": "Serena Dress S",
    "brand": "Those Studios",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 240000,
    "depositPrice": 700000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_serena.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_serena.jpg"
    ]
  },
  {
    "id": "T192",
    "slug": "vira-dress-t192",
    "name": "Vira Dress",
    "brand": "Tiela",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 240000,
    "depositPrice": 800000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_vira.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_vira.jpg"
    ]
  },
  {
    "id": "T012",
    "slug": "mie-dress-t012",
    "name": "Mie Dress",
    "brand": "Sò Vintage",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 230000,
    "depositPrice": 700000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_mie.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_mie.jpg"
    ]
  },
  {
    "id": "T155",
    "slug": "lepia-dress-t155",
    "name": "Lepia dress",
    "brand": "Sò Vintage",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 220000,
    "depositPrice": 600000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_lepia.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_lepia.jpg"
    ]
  },
  {
    "id": "T175",
    "slug": "yasmin-dress-t175",
    "name": "Yasmin Dress",
    "brand": "Afrodille",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 220000,
    "depositPrice": 800000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_yasmin.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_yasmin.jpg"
    ]
  },
  {
    "id": "T059",
    "slug": "eily-dress-m-t059",
    "name": "Eily Dress M",
    "brand": "Those Studios",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 210000,
    "depositPrice": 400000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_eily.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_eily.jpg"
    ]
  },
  {
    "id": "T148",
    "slug": "eily-dress-s-t148",
    "name": "Eily dress S",
    "brand": "Those Studios",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 210000,
    "depositPrice": 400000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_eily.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_eily.jpg"
    ]
  },
  {
    "id": "T029",
    "slug": "elina-dress-t029",
    "name": "Elina Dress",
    "brand": "JuletbyGiang",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 210000,
    "depositPrice": 500000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_elina.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_elina.jpg"
    ]
  },
  {
    "id": "T186",
    "slug": "elize-dress-m-t186",
    "name": "Elize Dress M",
    "brand": "Those Studios",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 210000,
    "depositPrice": 600000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_elize.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_elize.jpg"
    ]
  },
  {
    "id": "T185",
    "slug": "elize-dress-s-t185",
    "name": "Elize Dress S",
    "brand": "Those Studios",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 210000,
    "depositPrice": 600000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_elize.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_elize.jpg"
    ]
  },
  {
    "id": "T123",
    "slug": "fiona-dress-l-t123",
    "name": "Fiona dress L",
    "brand": "Wonderhouse",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 210000,
    "depositPrice": 600000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_fiona.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_fiona.jpg"
    ]
  },
  {
    "id": "T084",
    "slug": "fiona-dress-m-t084",
    "name": "Fiona dress M",
    "brand": "Wonderhouse",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 210000,
    "depositPrice": 600000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_fiona.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_fiona.jpg"
    ]
  },
  {
    "id": "T035",
    "slug": "fiona-dress-s-t035",
    "name": "Fiona Dress S",
    "brand": "Wonderhouse",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 210000,
    "depositPrice": 600000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_fiona.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_fiona.jpg"
    ]
  },
  {
    "id": "T195",
    "slug": "keva-dress-m-t195",
    "name": "Keva Dress M",
    "brand": "Tiela",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 210000,
    "depositPrice": 600000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_keva%20(2).jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_keva%20(2).jpg",
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_keva.jpg"
    ]
  },
  {
    "id": "T194",
    "slug": "keva-dress-s-t194",
    "name": "Keva Dress S",
    "brand": "Tiela",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 210000,
    "depositPrice": 600000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_keva%20(2).jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_keva%20(2).jpg",
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_keva.jpg"
    ]
  },
  {
    "id": "T075",
    "slug": "milan-dress-m-t075",
    "name": "Milan Dress M",
    "brand": "Wonderhouse",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 210000,
    "depositPrice": 600000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_milan.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_milan.jpg"
    ]
  },
  {
    "id": "T034",
    "slug": "milan-dress-s-t034",
    "name": "Milan Dress S",
    "brand": "Wonderhouse",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 210000,
    "depositPrice": 600000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_milan.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_milan.jpg"
    ]
  },
  {
    "id": "T061",
    "slug": "oliver-dress-m-t061",
    "name": "Oliver Dress M",
    "brand": "Those Studios",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 210000,
    "depositPrice": 400000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_oliver.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_oliver.jpg"
    ]
  },
  {
    "id": "T006",
    "slug": "oliver-dress-s-t006",
    "name": "Oliver dress S",
    "brand": "Those Studios",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 210000,
    "depositPrice": 400000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_oliver.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_oliver.jpg"
    ]
  },
  {
    "id": "T197",
    "slug": "orla-dress-t197",
    "name": "Orla Dress",
    "brand": "Sò Vintage",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 210000,
    "depositPrice": 600000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_orla.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_orla.jpg"
    ]
  },
  {
    "id": "T096",
    "slug": "alva-dress-t096",
    "name": "Alva dress",
    "brand": "Flane",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 200000,
    "depositPrice": 400000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_alva.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_alva.jpg"
    ]
  },
  {
    "id": "T064",
    "slug": "amant-dress-t064",
    "name": "Amant Dress",
    "brand": "Amelia",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 200000,
    "depositPrice": 400000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_amant.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_amant.jpg"
    ]
  },
  {
    "id": "T063",
    "slug": "amy-dress-m-t063",
    "name": "Amy Dress M",
    "brand": "Wonderhouse",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 200000,
    "depositPrice": 600000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_amy.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_amy.jpg"
    ]
  },
  {
    "id": "T001",
    "slug": "amy-dress-s-t001",
    "name": "Amy Dress S",
    "brand": "Wonderhouse",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 200000,
    "depositPrice": 600000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_amy.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_amy.jpg"
    ]
  },
  {
    "id": "T190",
    "slug": "felia-dress-hong-s-t190",
    "name": "Felia Dress Hồng S",
    "brand": "Wonderhouse",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 200000,
    "depositPrice": 500000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_felia_hong.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_felia_hong.jpg"
    ]
  },
  {
    "id": "T170",
    "slug": "femila-dress-l-trang-t170",
    "name": "Femila dress L trắng",
    "brand": "Wonderhouse",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 200000,
    "depositPrice": 400000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_femila.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_femila.jpg"
    ]
  },
  {
    "id": "T036",
    "slug": "femila-dress-s-trang-t036",
    "name": "Femila Dress S Trắng",
    "brand": "Wonderhouse",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 200000,
    "depositPrice": 400000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_femila.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_femila.jpg"
    ]
  },
  {
    "id": "T065",
    "slug": "hazel-dress-t065",
    "name": "Hazel Dress",
    "brand": "Amelia",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 200000,
    "depositPrice": 400000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_hazel.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_hazel.jpg"
    ]
  },
  {
    "id": "T044",
    "slug": "joy-dress-s-t044",
    "name": "Joy Dress S",
    "brand": "Jolie Loft",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 200000,
    "depositPrice": 300000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_joy.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_joy.jpg"
    ]
  },
  {
    "id": "T045",
    "slug": "joy-dress-xs-t045",
    "name": "Joy Dress XS",
    "brand": "Jolie Loft",
    "sizes": [
      "XS"
    ],
    "category": "dam-vay",
    "rentPrice": 200000,
    "depositPrice": 300000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_joy.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_joy.jpg"
    ]
  },
  {
    "id": "T091",
    "slug": "lara-dress-t091",
    "name": "Lara dress",
    "brand": "Lagom",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 200000,
    "depositPrice": 400000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_lara.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_lara.jpg"
    ]
  },
  {
    "id": "T058",
    "slug": "layla-dress-m-t058",
    "name": "Layla Dress M",
    "brand": "Jolie Loft",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 200000,
    "depositPrice": 300000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_layla_jolieloft.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_layla_jolieloft.jpg"
    ]
  },
  {
    "id": "T073",
    "slug": "losia-dress-m-t073",
    "name": "Losia Dress M",
    "brand": "Itscicico",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 200000,
    "depositPrice": 300000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_losia.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_losia.jpg"
    ]
  },
  {
    "id": "T021",
    "slug": "losia-dress-s-t021",
    "name": "Losia Dress S",
    "brand": "Itscicico",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 200000,
    "depositPrice": 300000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_losia.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_losia.jpg"
    ]
  },
  {
    "id": "T166",
    "slug": "lua-dress-t166",
    "name": "Lua Dress",
    "brand": "Wonderhouse",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 200000,
    "depositPrice": 500000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_lua.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_lua.jpg"
    ]
  },
  {
    "id": "T068",
    "slug": "luph-dress-m-t068",
    "name": "Luph Dress M",
    "brand": "Jolie Loft",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 200000,
    "depositPrice": 400000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_luph.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_luph.jpg"
    ]
  },
  {
    "id": "T018",
    "slug": "luph-dress-s-t018",
    "name": "Luph Dress S",
    "brand": "Jolie Loft",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 200000,
    "depositPrice": 400000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_luph.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_luph.jpg"
    ]
  },
  {
    "id": "T122",
    "slug": "missi-dress-l-t122",
    "name": "Missi dress L",
    "brand": "Wonderhouse",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 200000,
    "depositPrice": 400000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_missi.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_missi.jpg"
    ]
  },
  {
    "id": "T080",
    "slug": "missi-dress-m-t080",
    "name": "Missi dress M",
    "brand": "Wonderhouse",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 200000,
    "depositPrice": 400000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_missi.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_missi.jpg"
    ]
  },
  {
    "id": "T022",
    "slug": "missi-dress-s-t022",
    "name": "Missi Dress S",
    "brand": "Wonderhouse",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 200000,
    "depositPrice": 400000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_missi.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_missi.jpg"
    ]
  },
  {
    "id": "T032",
    "slug": "sun-dress-t032",
    "name": "Sun Dress",
    "brand": "Trân Ali",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 200000,
    "depositPrice": 400000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_sun.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_sun.jpg"
    ]
  },
  {
    "id": "T055",
    "slug": "aura-dress-t055",
    "name": "Aura Dress",
    "brand": "JuletbyGiang",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 190000,
    "depositPrice": 300000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_aura.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_aura.jpg"
    ]
  },
  {
    "id": "T179",
    "slug": "cat-dress-t179",
    "name": "Cat dress",
    "brand": "Coem",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 190000,
    "depositPrice": 500000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_cat.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_cat.jpg"
    ]
  },
  {
    "id": "T154",
    "slug": "isabella-dress-hong-t154",
    "name": "Isabella dress hồng",
    "brand": "Amelie",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 190000,
    "depositPrice": 500000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_isabella.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_isabella.jpg"
    ]
  },
  {
    "id": "T095",
    "slug": "lily-dress-m-t095",
    "name": "Lily dress M",
    "brand": "Jolie Loft",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 190000,
    "depositPrice": 300000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_lily.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_lily.jpg"
    ]
  },
  {
    "id": "T043",
    "slug": "lily-dress-s-t043",
    "name": "Lily Dress S",
    "brand": "Jolie Loft",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 190000,
    "depositPrice": 300000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_lily.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_lily.jpg"
    ]
  },
  {
    "id": "T159",
    "slug": "monte-dress-t159",
    "name": "Monte Dress",
    "brand": "JuletbyGiang",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 190000,
    "depositPrice": 500000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_monte.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_monte.jpg"
    ]
  },
  {
    "id": "T162",
    "slug": "nami-dress-t162",
    "name": "Nami dress",
    "brand": "Khiet",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 190000,
    "depositPrice": 500000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_nami.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_nami.jpg"
    ]
  },
  {
    "id": "T144",
    "slug": "novia-set-t144",
    "name": "Novia set",
    "brand": "Lagom",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 190000,
    "depositPrice": 300000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_novia.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_novia.jpg"
    ]
  },
  {
    "id": "T019",
    "slug": "phoebe-dress-t019",
    "name": "Phoebe Dress",
    "brand": "Ceci",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 190000,
    "depositPrice": 300000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_phoebe.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_phoebe.jpg"
    ]
  },
  {
    "id": "T005",
    "slug": "reina-dress-t005",
    "name": "Reina Dress",
    "brand": "Amelia",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 190000,
    "depositPrice": 400000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_reina.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_reina.jpg"
    ]
  },
  {
    "id": "T199",
    "slug": "senna-dress-t199",
    "name": "Senna Dress",
    "brand": "Cira",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 190000,
    "depositPrice": 500000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_senna.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_senna.jpg"
    ]
  },
  {
    "id": "T174",
    "slug": "lanthe-dress-t174",
    "name": "Lanthe Dress",
    "brand": "OLV",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 180000,
    "depositPrice": 500000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_lanthe.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_lanthe.jpg"
    ]
  },
  {
    "id": "T056",
    "slug": "lumia-dress-t056",
    "name": "Lumia Dress",
    "brand": "Lagom",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 180000,
    "depositPrice": 300000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_lumi.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_lumi.jpg"
    ]
  },
  {
    "id": "T177",
    "slug": "sarah-dress-t177",
    "name": "Sarah Dress",
    "brand": "Celeste",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 180000,
    "depositPrice": 500000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_sarah.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_sarah.jpg"
    ]
  },
  {
    "id": "T181",
    "slug": "vanilla-dress-t181",
    "name": "Vanilla Dress",
    "brand": "Wonderhouse",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 180000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_vanilla_wonderhouse.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_vanilla_wonderhouse.jpg"
    ]
  },
  {
    "id": "T147",
    "slug": "ocean-dress-t147",
    "name": "Ocean dress",
    "brand": null,
    "sizes": [
      "Freesize"
    ],
    "category": "dam-vay",
    "rentPrice": 170000,
    "depositPrice": 400000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_ocena.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_ocena.jpg"
    ]
  },
  {
    "id": "T163",
    "slug": "libea-dress-t163",
    "name": "Libea Dress",
    "brand": "Dressesinsilk",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 160000,
    "depositPrice": 400000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_Libea.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_Libea.jpg"
    ]
  },
  {
    "id": "T173",
    "slug": "rosie-dress-t173",
    "name": "Rosie Dress",
    "brand": "Lagom",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 160000,
    "depositPrice": 300000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_rosie.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_rosie.jpg"
    ]
  },
  {
    "id": "T157",
    "slug": "ad6-nguyet-anh-t157",
    "name": "AD6 Nguyệt Ảnh",
    "brand": "Tiinstore",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 150000,
    "depositPrice": 300000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/ao_dai_nguyetanh.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/ao_dai_nguyetanh.jpg"
    ]
  },
  {
    "id": "T156",
    "slug": "ad79-thanh-tieu-t156",
    "name": "AD79 Thanh Tiêu",
    "brand": "Tiinstore",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 150000,
    "depositPrice": 300000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/ao_dai_thanhtieu.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/ao_dai_thanhtieu.jpg"
    ]
  },
  {
    "id": "T158",
    "slug": "ad80-kim-chau-t158",
    "name": "AD80 Kim Châu",
    "brand": "Tiinstore",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 150000,
    "depositPrice": 300000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/ao_dai_kimchau.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/ao_dai_kimchau.jpg"
    ]
  },
  {
    "id": "T103",
    "slug": "janie-dress-den-t103",
    "name": "Janie dress (đen)",
    "brand": "Dressesinsilk",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 150000,
    "depositPrice": 300000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_janie.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_janie.jpg"
    ]
  },
  {
    "id": "T118",
    "slug": "janie-dress-kem-t118",
    "name": "Janie dress (kem)",
    "brand": "Dressesinsilk",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 150000,
    "depositPrice": 300000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_janie.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_janie.jpg"
    ]
  },
  {
    "id": "T164",
    "slug": "kumi-dress-m-t164",
    "name": "Kumi Dress M",
    "brand": "Aguja",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 150000,
    "depositPrice": 300000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay%20thiet%20ke-%20kumi.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay%20thiet%20ke-%20kumi.jpg"
    ]
  },
  {
    "id": "T165",
    "slug": "kumi-dress-s-t165",
    "name": "Kumi Dress S",
    "brand": "Aguja",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 150000,
    "depositPrice": 300000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay%20thiet%20ke-%20kumi.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay%20thiet%20ke-%20kumi.jpg"
    ]
  },
  {
    "id": "T121",
    "slug": "ahri-dress-l-t121",
    "name": "Ahri dress L",
    "brand": null,
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 120000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_ahri.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_ahri.jpg"
    ]
  },
  {
    "id": "T086",
    "slug": "ahri-dress-m-t086",
    "name": "Ahri dress M",
    "brand": null,
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 120000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_ahri.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_ahri.jpg"
    ]
  },
  {
    "id": "AD056",
    "slug": "ad78-luu-ly-ad056",
    "name": "AD78 Lưu Ly",
    "brand": "Tiinstore",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/ao_dai_luuly.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/ao_dai_luuly.jpg"
    ]
  },
  {
    "id": "PP001",
    "slug": "pp01-ha-lien-m-pp001",
    "name": "PP01 Hạ Liên M",
    "brand": null,
    "sizes": [
      "M"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp01_ha_lien_M.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp01_ha_lien_M.jpg"
    ]
  },
  {
    "id": "PP010",
    "slug": "pp010-van-dao-m-pp010",
    "name": "PP010 Vân Đào M",
    "brand": null,
    "sizes": [
      "S"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp10_van_dao.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp10_van_dao.jpg"
    ]
  },
  {
    "id": "PP011",
    "slug": "pp011-nhue-dao-s-pp011",
    "name": "PP011 Nhuế Đào S",
    "brand": null,
    "sizes": [
      "M"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp11_nhue_dao.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp11_nhue_dao.jpg"
    ]
  },
  {
    "id": "PP012",
    "slug": "pp012-van-hoang-m-pp012",
    "name": "PP012 Vân Hoàng M",
    "brand": null,
    "sizes": [
      "M"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp12_van_hoang.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp12_van_hoang.jpg"
    ]
  },
  {
    "id": "PP013",
    "slug": "pp013-thien-da-m-pp013",
    "name": "PP013 Thiên Dạ M",
    "brand": null,
    "sizes": [
      "M"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp13_thien_da.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp13_thien_da.jpg"
    ]
  },
  {
    "id": "PP016",
    "slug": "pp016-nhu-y-l-pp016",
    "name": "PP016 Như Ý L",
    "brand": null,
    "sizes": [
      "L"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp16_nhu_y_L.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp16_nhu_y_L.jpg"
    ]
  },
  {
    "id": "PP002",
    "slug": "pp02-tu-anh-m-pp002",
    "name": "PP02 Tú Anh M",
    "brand": null,
    "sizes": [
      "M"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/PP02_tu_anh.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/PP02_tu_anh.jpg",
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp02_tu_anh_M.jpg"
    ]
  },
  {
    "id": "PP003",
    "slug": "pp03-thien-thanh-m-pp003",
    "name": "PP03 Thiên Thanh M",
    "brand": null,
    "sizes": [
      "M"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp03_thien_thanh_M.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp03_thien_thanh_M.jpg"
    ]
  },
  {
    "id": "PP004",
    "slug": "pp04-tam-giao-be-l-pp004",
    "name": "PP04 Tâm giao be L",
    "brand": null,
    "sizes": [
      "L"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp4_tam_giao_be_L.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp4_tam_giao_be_L.jpg"
    ]
  },
  {
    "id": "PP005",
    "slug": "pp05-moc-mien-m-pp005",
    "name": "PP05 Mộc Miên M",
    "brand": null,
    "sizes": [
      "M"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp5_moc_mien.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp5_moc_mien.jpg"
    ]
  },
  {
    "id": "PP006",
    "slug": "pp06-lien-tam-m-pp006",
    "name": "PP06 Liên Tâm M",
    "brand": null,
    "sizes": [
      "M"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp06_lien_tam_M.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp06_lien_tam_M.jpg"
    ]
  },
  {
    "id": "PP007",
    "slug": "pp07-tam-giao-hong-l-pp007",
    "name": "PP07 Tâm Giao Hồng L",
    "brand": null,
    "sizes": [
      "L"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp7_tam_giao_hong_L.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp7_tam_giao_hong_L.jpg"
    ]
  },
  {
    "id": "PP009",
    "slug": "pp09-suong-khe-m-pp009",
    "name": "PP09 Sương Khê M",
    "brand": null,
    "sizes": [
      "M"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp09_suong_khue_M.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp09_suong_khue_M.jpg"
    ]
  },
  {
    "id": "PP014",
    "slug": "pp14-chau-anh-hong-l-pp014",
    "name": "PP14 Châu Anh hồng L",
    "brand": null,
    "sizes": [
      "L"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp14_chau_anh_hong_L.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp14_chau_anh_hong_L.jpg"
    ]
  },
  {
    "id": "PP015",
    "slug": "pp15-nhu-y-m-pp015",
    "name": "PP15 Như Ý M",
    "brand": null,
    "sizes": [
      "M"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp15_nhu_y_M.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp15_nhu_y_M.jpg"
    ]
  },
  {
    "id": "PP017",
    "slug": "pp17-tam-giao-be-m-pp017",
    "name": "PP17 Tâm Giao be M",
    "brand": null,
    "sizes": [
      "M"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp17_tam_giao_be_M%20(2).jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp17_tam_giao_be_M%20(2).jpg",
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp17_tam_giao_be_M.jpg"
    ]
  },
  {
    "id": "PP018",
    "slug": "pp18-tam-giao-xanh-duong-m-pp018",
    "name": "PP18 Tâm Giao xanh dương M",
    "brand": null,
    "sizes": [
      "M"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp18_tam_giao_xanh_Duong_M.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp18_tam_giao_xanh_Duong_M.jpg"
    ]
  },
  {
    "id": "PP019",
    "slug": "pp19-tam-giao-xanh-duong-l-pp019",
    "name": "PP19 Tâm Giao xanh dương L",
    "brand": null,
    "sizes": [
      "L"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp19_tam_giao_xanh_duong_L.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp19_tam_giao_xanh_duong_L.jpg"
    ]
  },
  {
    "id": "PP020",
    "slug": "pp20-lam-tien-s-pp020",
    "name": "PP20 Lam Tiên S",
    "brand": null,
    "sizes": [
      "S"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp20_lam_tien_S.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp20_lam_tien_S.jpg"
    ]
  },
  {
    "id": "PP021",
    "slug": "pp21-tam-giao-hong-m-pp021",
    "name": "PP21 Tâm Giao hồng M",
    "brand": null,
    "sizes": [
      "M"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 250000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp21_tam_giao_hong_M.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp21_tam_giao_hong_M.jpg"
    ]
  },
  {
    "id": "PP022",
    "slug": "pp22-minh-nguyet-trang-s-pp022",
    "name": "PP22 Minh Nguyệt trắng S",
    "brand": null,
    "sizes": [
      "S"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp22_minh_nguyet_trang_S.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp22_minh_nguyet_trang_S.jpg"
    ]
  },
  {
    "id": "PP023",
    "slug": "pp23-minh-nguyet-tim-m-pp023",
    "name": "PP23 Minh Nguyệt tím M",
    "brand": null,
    "sizes": [
      "M"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp23_minh_nguyet_tim_L.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp23_minh_nguyet_tim_L.jpg"
    ]
  },
  {
    "id": "PP024",
    "slug": "pp24-van-chi-vang-nhat-m-pp024",
    "name": "PP24 Vân Chi Vàng Nhạt M",
    "brand": null,
    "sizes": [
      "M"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp24_van_Chi_vang_M.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp24_van_Chi_vang_M.jpg"
    ]
  },
  {
    "id": "PP025",
    "slug": "pp25-minh-nguyet-hong-l-pp025",
    "name": "PP25 Minh Nguyệt hồng L",
    "brand": null,
    "sizes": [
      "L"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp25_minh_nguyet_hong_L%20(2).jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp25_minh_nguyet_hong_L%20(2).jpg"
    ]
  },
  {
    "id": "PP026",
    "slug": "pp26-minh-nguyet-xanh-duong-l-pp026",
    "name": "PP26 Minh Nguyệt xanh dương L",
    "brand": null,
    "sizes": [
      "L"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp26_minh_ngueyt_xanh_duong_L.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp26_minh_ngueyt_xanh_duong_L.jpg"
    ]
  },
  {
    "id": "PP027",
    "slug": "pp27-van-chi-hong-dam-m-pp027",
    "name": "PP27 Vân Chi hồng đậm M",
    "brand": null,
    "sizes": [
      "M"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp27_van_chi_hong_dam_M.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp27_van_chi_hong_dam_M.jpg"
    ]
  },
  {
    "id": "PP028",
    "slug": "pp28-van-chi-hong-dam-l-pp028",
    "name": "PP28 Vân Chi hồng đậm L",
    "brand": null,
    "sizes": [
      "L"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp28_van_chi_hong_dam_L.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp28_van_chi_hong_dam_L.jpg"
    ]
  },
  {
    "id": "PP029",
    "slug": "pp29-van-chi-hong-nhat-m-pp029",
    "name": "PP29 Vân Chi hồng nhạt M",
    "brand": null,
    "sizes": [
      "M"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp29_van_chi_hong_nhat_M.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp29_van_chi_hong_nhat_M.jpg"
    ]
  },
  {
    "id": "PP030",
    "slug": "pp30-van-chi-xanh-duong-nhat-m-pp030",
    "name": "PP30 Vân Chi xanh dương nhạt M",
    "brand": null,
    "sizes": [
      "M"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/PP30_van_chi_xanh_duong_nhat_M.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/PP30_van_chi_xanh_duong_nhat_M.jpg"
    ]
  },
  {
    "id": "PP031",
    "slug": "pp31-van-chi-xanh-duong-dam-m-pp031",
    "name": "PP31 Vân Chi xanh dương đậm M",
    "brand": null,
    "sizes": [
      "M"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp31_van_chi_xanh_duong_dam_M.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp31_van_chi_xanh_duong_dam_M.jpg"
    ]
  },
  {
    "id": "PP032",
    "slug": "pp32-van-chi-tim-m-pp032",
    "name": "PP32 Vân Chi tím M",
    "brand": null,
    "sizes": [
      "M"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp32_van_chi_tim_M.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp32_van_chi_tim_M.jpg"
    ]
  },
  {
    "id": "PP033",
    "slug": "pp33-van-chi-tim-l-pp033",
    "name": "PP33 Vân Chi tím L",
    "brand": null,
    "sizes": [
      "L"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp33_van_chi_tim_M.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp33_van_chi_tim_M.jpg"
    ]
  },
  {
    "id": "PP034",
    "slug": "pp34-linh-dan-trang-m-pp034",
    "name": "PP34 Linh Đan trắng M",
    "brand": null,
    "sizes": [
      "M"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp34_linh_dan_trang_M.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp34_linh_dan_trang_M.jpg"
    ]
  },
  {
    "id": "PP035",
    "slug": "pp35-linh-dan-xanh-la-m-pp035",
    "name": "PP35 Linh Đan xanh lá M",
    "brand": null,
    "sizes": [
      "M"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp35_linh_dan_xanh_la_M.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp35_linh_dan_xanh_la_M.jpg"
    ]
  },
  {
    "id": "PP036",
    "slug": "pp36-linh-dan-hong-m-pp036",
    "name": "PP36 Linh Đan hồng M",
    "brand": null,
    "sizes": [
      "M"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp36_linh_dan_hong_M.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp36_linh_dan_hong_M.jpg"
    ]
  },
  {
    "id": "PP037",
    "slug": "pp37-chau-anh-xanh-la-m-pp037",
    "name": "PP37 Châu Anh xanh lá M",
    "brand": null,
    "sizes": [
      "M"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp37_chau_anh_xanh_la_M.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp37_chau_anh_xanh_la_M.jpg"
    ]
  },
  {
    "id": "PP038",
    "slug": "pp38-dieu-an-m-pp038",
    "name": "PP38 DIệu An M",
    "brand": null,
    "sizes": [
      "M"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp38_dieu_an_M.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp38_dieu_an_M.jpg"
    ]
  },
  {
    "id": "PP039",
    "slug": "pp39-quynh-anh-trang-m-pp039",
    "name": "PP39 Quỳnh Anh trắng M",
    "brand": null,
    "sizes": [
      "M"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp39_quynh_anh_trang_M.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp39_quynh_anh_trang_M.jpg"
    ]
  },
  {
    "id": "PP040",
    "slug": "pp40-quynh-anh-vang-m-pp040",
    "name": "PP40 Quỳnh Anh vàng M",
    "brand": null,
    "sizes": [
      "M"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp40_quynh_anh_vang_M.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp40_quynh_anh_vang_M.jpg"
    ]
  },
  {
    "id": "PP041",
    "slug": "pp41-quynh-anh-hong-m-pp041",
    "name": "PP41 Quỳnh Anh hồng M",
    "brand": null,
    "sizes": [
      "M"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp41_quynh_anh_hong_M.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp41_quynh_anh_hong_M.jpg"
    ]
  },
  {
    "id": "PP042",
    "slug": "pp42-quynh-anh-xanh-m-pp042",
    "name": "PP42 Quỳnh Anh xanh M",
    "brand": null,
    "sizes": [
      "M"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/PP42_quynh_anh_xanh_M.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/PP42_quynh_anh_xanh_M.jpg"
    ]
  },
  {
    "id": "PP043",
    "slug": "pp43-ha-vy-kem-m-pp043",
    "name": "PP43 Hạ Vy kem M",
    "brand": null,
    "sizes": [
      "M"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/PP43_ha_vy_kem_M.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/PP43_ha_vy_kem_M.jpg"
    ]
  },
  {
    "id": "PP044",
    "slug": "pp44-ha-vy-kem-l-pp044",
    "name": "PP44 Hạ Vy kem L",
    "brand": null,
    "sizes": [
      "L"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/PP44_ha_vy_kem_L.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/PP44_ha_vy_kem_L.jpg"
    ]
  },
  {
    "id": "PP045",
    "slug": "pp45-ha-vy-cam-m-pp045",
    "name": "PP45 Hạ Vy cam M",
    "brand": null,
    "sizes": [
      "M"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp45_ha_vy_cam_M.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp45_ha_vy_cam_M.jpg"
    ]
  },
  {
    "id": "PP046",
    "slug": "pp46-ha-vy-cam-l-pp046",
    "name": "PP46 Hạ Vy cam L",
    "brand": null,
    "sizes": [
      "L"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp46_ha_vy_cam_L.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp46_ha_vy_cam_L.jpg"
    ]
  },
  {
    "id": "PP047",
    "slug": "pp47-xuan-lan-hong-m-pp047",
    "name": "PP47 Xuân Lan hồng M",
    "brand": null,
    "sizes": [
      "M"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp47_xuan_lan_hong_M.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp47_xuan_lan_hong_M.jpg"
    ]
  },
  {
    "id": "PP048",
    "slug": "pp48-tam-giao-xanh-la-m-pp048",
    "name": "PP48 Tâm Giao xanh lá M",
    "brand": null,
    "sizes": [
      "M"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/PP48_tam_giao_xanh_la_M.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/PP48_tam_giao_xanh_la_M.jpg"
    ]
  },
  {
    "id": "PP049",
    "slug": "pp49-tam-giao-xanh-la-l-pp049",
    "name": "PP49 Tâm Giao xanh lá L",
    "brand": null,
    "sizes": [
      "L"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp49_tam_giao_xanh_la_L.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp49_tam_giao_xanh_la_L.jpg"
    ]
  },
  {
    "id": "PP050",
    "slug": "pp50-bao-an-trang-l-pp050",
    "name": "PP50 Bảo An trắng L",
    "brand": null,
    "sizes": [
      "L"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp50_bao_an_trang_L.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp50_bao_an_trang_L.jpg"
    ]
  },
  {
    "id": "PP051",
    "slug": "pp51-chu-tuoc-do-s-pp051",
    "name": "PP51 Chu tước đỏ S",
    "brand": null,
    "sizes": [
      "S"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/PP51_chu_tuoc_do.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/PP51_chu_tuoc_do.jpg"
    ]
  },
  {
    "id": "PP052",
    "slug": "pp52-bao-an-hong-m-pp052",
    "name": "PP52 Bảo An hồng M",
    "brand": null,
    "sizes": [
      "M"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp52_bao_an_hong_M.jpg",
    "images": [
      "https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/pp52_bao_an_hong_M.jpg"
    ]
  },
  {
    "id": "T104",
    "slug": "ivy-silk-dress-t104",
    "name": "Ivy silk dress",
    "brand": "Kisserine",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 450000,
    "depositPrice": 1000000,
    "image": null,
    "images": []
  },
  {
    "id": "T124",
    "slug": "paris-cape-dress-t124",
    "name": "Paris Cape dress",
    "brand": "Jennie Choo",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 370000,
    "depositPrice": 1500000,
    "image": null,
    "images": []
  },
  {
    "id": "T099",
    "slug": "acelia-dress-den-l-t099",
    "name": "Acelia dress đen L",
    "brand": "Sò Vintage",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 350000,
    "depositPrice": 1500000,
    "image": null,
    "images": []
  },
  {
    "id": "T113",
    "slug": "darie-dress-t113",
    "name": "Darie dress",
    "brand": "Sò Vintage",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 350000,
    "depositPrice": 1500000,
    "image": null,
    "images": []
  },
  {
    "id": "T041",
    "slug": "gem-dress-t041",
    "name": "Gem Dress",
    "brand": "Onomade",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 300000,
    "depositPrice": 600000,
    "image": null,
    "images": []
  },
  {
    "id": "T033",
    "slug": "eveline-dress-t033",
    "name": "Eveline Dress",
    "brand": "Sò Vintage",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 280000,
    "depositPrice": 600000,
    "image": null,
    "images": []
  },
  {
    "id": "T191",
    "slug": "kata-dress-t191",
    "name": "Kata Dress",
    "brand": "Jolie Loft",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 270000,
    "depositPrice": 700000,
    "image": null,
    "images": []
  },
  {
    "id": "T120",
    "slug": "kira-dress-t120",
    "name": "Kira dress",
    "brand": "Sò Vintage",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 270000,
    "depositPrice": 600000,
    "image": null,
    "images": []
  },
  {
    "id": "T116",
    "slug": "athelia-dress-t116",
    "name": "Athelia dress",
    "brand": "Sò Vintage",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 260000,
    "depositPrice": 600000,
    "image": null,
    "images": []
  },
  {
    "id": "T010",
    "slug": "beala-dress-t010",
    "name": "Beala Dress",
    "brand": "Sò Vintage",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 250000,
    "depositPrice": 600000,
    "image": null,
    "images": []
  },
  {
    "id": "T093",
    "slug": "chic-dress-t093",
    "name": "Chic dress",
    "brand": "Jolie Loft",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 250000,
    "depositPrice": 400000,
    "image": null,
    "images": []
  },
  {
    "id": "T023",
    "slug": "ciara-dress-t023",
    "name": "Ciara Dress",
    "brand": "Luciana",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 250000,
    "depositPrice": 400000,
    "image": null,
    "images": []
  },
  {
    "id": "T040",
    "slug": "donna-dress-t040",
    "name": "Donna Dress",
    "brand": "Luciana",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 250000,
    "depositPrice": 400000,
    "image": null,
    "images": []
  },
  {
    "id": "T125",
    "slug": "joie-dress-t125",
    "name": "Joie dress",
    "brand": "Poxi",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 250000,
    "depositPrice": 400000,
    "image": null,
    "images": []
  },
  {
    "id": "T127",
    "slug": "lillie-dress-t127",
    "name": "Lillie dress",
    "brand": "Meobyantran",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 250000,
    "depositPrice": 400000,
    "image": null,
    "images": []
  },
  {
    "id": "T031",
    "slug": "momo-dress-t031",
    "name": "Momo Dress",
    "brand": "Sò Vintage",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 250000,
    "depositPrice": 600000,
    "image": null,
    "images": []
  },
  {
    "id": "T092",
    "slug": "moni-dress-t092",
    "name": "Moni dress",
    "brand": "Sauvee",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 250000,
    "depositPrice": 700000,
    "image": null,
    "images": []
  },
  {
    "id": "T076",
    "slug": "sera-dress-t076",
    "name": "Sera Dress",
    "brand": "Sauvee",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 250000,
    "depositPrice": 400000,
    "image": null,
    "images": []
  },
  {
    "id": "T126",
    "slug": "dam-tre-vai-trang-t126",
    "name": "Đầm trễ vai trắng",
    "brand": "Meoshop",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 230000,
    "depositPrice": 400000,
    "image": null,
    "images": []
  },
  {
    "id": "T110",
    "slug": "liberty-dress-t110",
    "name": "Liberty dress",
    "brand": "Poxi",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 230000,
    "depositPrice": 600000,
    "image": null,
    "images": []
  },
  {
    "id": "T046",
    "slug": "oli-dress-t046",
    "name": "Oli Dress",
    "brand": "Jolie Loft",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 230000,
    "depositPrice": 400000,
    "image": null,
    "images": []
  },
  {
    "id": "T026",
    "slug": "sherry-dress-t026",
    "name": "Sherry Dress",
    "brand": "Sauvee",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 230000,
    "depositPrice": 500000,
    "image": null,
    "images": []
  },
  {
    "id": "T053",
    "slug": "talitha-dress-s-t053",
    "name": "Talitha Dress S",
    "brand": "Those Studios",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 230000,
    "depositPrice": 600000,
    "image": null,
    "images": []
  },
  {
    "id": "T016",
    "slug": "maven-t016",
    "name": "Maven",
    "brand": null,
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 220000,
    "depositPrice": 400000,
    "image": null,
    "images": []
  },
  {
    "id": "T051",
    "slug": "seraphina-dress-t051",
    "name": "Seraphina Dress",
    "brand": "Khiet",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 220000,
    "depositPrice": 600000,
    "image": null,
    "images": []
  },
  {
    "id": "T109",
    "slug": "sisi-dress-t109",
    "name": "Sisi dress",
    "brand": "Rubies",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 220000,
    "depositPrice": 300000,
    "image": null,
    "images": []
  },
  {
    "id": "T039",
    "slug": "tamy-dress-t039",
    "name": "Tamy Dress",
    "brand": "Trân Ali",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 220000,
    "depositPrice": 500000,
    "image": null,
    "images": []
  },
  {
    "id": "T003",
    "slug": "emily-dress-s-t003",
    "name": "Emily Dress S",
    "brand": "Those Studios",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 210000,
    "depositPrice": 600000,
    "image": null,
    "images": []
  },
  {
    "id": "T009",
    "slug": "ruby-dress-t009",
    "name": "Ruby Dress",
    "brand": "Trân Ali",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 210000,
    "depositPrice": 400000,
    "image": null,
    "images": []
  },
  {
    "id": "T067",
    "slug": "ruby-dress-t067",
    "name": "Ruby Dress",
    "brand": "Trân Ali",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 210000,
    "depositPrice": 400000,
    "image": null,
    "images": []
  },
  {
    "id": "T060",
    "slug": "tessa-dress-t060",
    "name": "Tessa Dress",
    "brand": "Those Studios",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 210000,
    "depositPrice": 600000,
    "image": null,
    "images": []
  },
  {
    "id": "T050",
    "slug": "dari-dress-t050",
    "name": "Dari Dress",
    "brand": "H.I.U Room",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 200000,
    "depositPrice": 400000,
    "image": null,
    "images": []
  },
  {
    "id": "T047",
    "slug": "diva-dress-t047",
    "name": "Diva Dress",
    "brand": "Amelie",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 200000,
    "depositPrice": 400000,
    "image": null,
    "images": []
  },
  {
    "id": "T087",
    "slug": "felia-dress-m-t087",
    "name": "Felia dress M",
    "brand": "Wonderhouse",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 200000,
    "depositPrice": 400000,
    "image": null,
    "images": []
  },
  {
    "id": "T038",
    "slug": "femila-dress-s-xanh-t038",
    "name": "Femila Dress S Xanh",
    "brand": "Wonderhouse",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 200000,
    "depositPrice": 400000,
    "image": null,
    "images": []
  },
  {
    "id": "T133",
    "slug": "finn-dress-t133",
    "name": "Finn dress",
    "brand": "Elpis",
    "sizes": [
      "XS"
    ],
    "category": "dam-vay",
    "rentPrice": 200000,
    "depositPrice": 300000,
    "image": null,
    "images": []
  },
  {
    "id": "T052",
    "slug": "janna-dress-t052",
    "name": "Janna Dress",
    "brand": "Khiet",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 200000,
    "depositPrice": 700000,
    "image": null,
    "images": []
  },
  {
    "id": "T085",
    "slug": "lavie-dress-t085",
    "name": "Lavie dress",
    "brand": "H.I.U Room",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 200000,
    "depositPrice": 400000,
    "image": null,
    "images": []
  },
  {
    "id": "T066",
    "slug": "levia-dress-m-t066",
    "name": "Levia Dress M",
    "brand": "Wonderhouse",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 200000,
    "depositPrice": 400000,
    "image": null,
    "images": []
  },
  {
    "id": "T007",
    "slug": "levia-dress-s-t007",
    "name": "Levia Dress S",
    "brand": "Wonderhouse",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 200000,
    "depositPrice": 400000,
    "image": null,
    "images": []
  },
  {
    "id": "T094",
    "slug": "loire-pink-dress-t094",
    "name": "Loire pink dress",
    "brand": "Jolie Loft",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 200000,
    "depositPrice": 400000,
    "image": null,
    "images": []
  },
  {
    "id": "T145",
    "slug": "mae-dress-t145",
    "name": "Mae dress",
    "brand": "Joiedesrose",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 200000,
    "depositPrice": 400000,
    "image": null,
    "images": []
  },
  {
    "id": "T088",
    "slug": "mita-dress-t088",
    "name": "Mita dress",
    "brand": "Trân Ali",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 200000,
    "depositPrice": 400000,
    "image": null,
    "images": []
  },
  {
    "id": "T132",
    "slug": "moore-dress-t132",
    "name": "Moore dress",
    "brand": "LSeoul",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 200000,
    "depositPrice": 400000,
    "image": null,
    "images": []
  },
  {
    "id": "T151",
    "slug": "nina-set-t151",
    "name": "Nina set",
    "brand": "Joiedesrose",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 200000,
    "depositPrice": 300000,
    "image": null,
    "images": []
  },
  {
    "id": "T097",
    "slug": "silk-dress-t097",
    "name": "Silk dress",
    "brand": "Jolie Loft",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 200000,
    "depositPrice": 300000,
    "image": null,
    "images": []
  },
  {
    "id": "T071",
    "slug": "venus-dress-t071",
    "name": "Venus Dress",
    "brand": "Vananhscarlet",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 200000,
    "depositPrice": 400000,
    "image": null,
    "images": []
  },
  {
    "id": "T013",
    "slug": "aisha-dress-t013",
    "name": "Aisha Dress",
    "brand": "Amelia",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 190000,
    "depositPrice": 400000,
    "image": null,
    "images": []
  },
  {
    "id": "T135",
    "slug": "angeli-dress-t135",
    "name": "Angeli dress",
    "brand": "Lesini",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 190000,
    "depositPrice": 300000,
    "image": null,
    "images": []
  },
  {
    "id": "T015",
    "slug": "ari-dress-t015",
    "name": "Ari Dress",
    "brand": "Khiet",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 190000,
    "depositPrice": 700000,
    "image": null,
    "images": []
  },
  {
    "id": "T152",
    "slug": "cherry-set-t152",
    "name": "Cherry set",
    "brand": "Tyclothing",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 190000,
    "depositPrice": 500000,
    "image": null,
    "images": []
  },
  {
    "id": "T140",
    "slug": "cloudy-set-t140",
    "name": "Cloudy set",
    "brand": "Tyclothing",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 190000,
    "depositPrice": 500000,
    "image": null,
    "images": []
  },
  {
    "id": "T082",
    "slug": "faris-dress-t082",
    "name": "Faris dress",
    "brand": "BBstore",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 190000,
    "depositPrice": 500000,
    "image": null,
    "images": []
  },
  {
    "id": "T004",
    "slug": "flora-dress-t004",
    "name": "Flora Dress",
    "brand": "Amelia",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 190000,
    "depositPrice": 400000,
    "image": null,
    "images": []
  },
  {
    "id": "T078",
    "slug": "garment-dress-m-t078",
    "name": "Garment dress M",
    "brand": "Amelie",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 190000,
    "depositPrice": 400000,
    "image": null,
    "images": []
  },
  {
    "id": "T049",
    "slug": "garment-dress-s-t049",
    "name": "Garment Dress S",
    "brand": "Amelie",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 190000,
    "depositPrice": 400000,
    "image": null,
    "images": []
  },
  {
    "id": "T077",
    "slug": "hana-dress-t077",
    "name": "Hana dress",
    "brand": "Trân Ali",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 190000,
    "depositPrice": 400000,
    "image": null,
    "images": []
  },
  {
    "id": "T141",
    "slug": "lace-mini-dress-t141",
    "name": "Lace Mini dress",
    "brand": "Onomade",
    "sizes": [
      "XS"
    ],
    "category": "dam-vay",
    "rentPrice": 190000,
    "depositPrice": 300000,
    "image": null,
    "images": []
  },
  {
    "id": "T134",
    "slug": "mochi-set-t134",
    "name": "Mochi set",
    "brand": "Soleil room",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 190000,
    "depositPrice": 400000,
    "image": null,
    "images": []
  },
  {
    "id": "T129",
    "slug": "noel-set-t129",
    "name": "Noel set",
    "brand": "Tyclothing",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 190000,
    "depositPrice": 400000,
    "image": null,
    "images": []
  },
  {
    "id": "T137",
    "slug": "rayeon-dress-t137",
    "name": "Rayeon dress",
    "brand": "Ninysmuse",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 190000,
    "depositPrice": 300000,
    "image": null,
    "images": []
  },
  {
    "id": "T200",
    "slug": "snow-white-t200",
    "name": "Snow white",
    "brand": "Tiela",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 190000,
    "depositPrice": 500000,
    "image": null,
    "images": []
  },
  {
    "id": "T089",
    "slug": "tila-dress-t089",
    "name": "Tila dress",
    "brand": "H.I.U Room",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 190000,
    "depositPrice": 400000,
    "image": null,
    "images": []
  },
  {
    "id": "T139",
    "slug": "tyree-set-t139",
    "name": "Tyree set",
    "brand": "Tyclothing",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 190000,
    "depositPrice": 300000,
    "image": null,
    "images": []
  },
  {
    "id": "T143",
    "slug": "chibi-set-t143",
    "name": "Chibi set",
    "brand": null,
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 180000,
    "depositPrice": 500000,
    "image": null,
    "images": []
  },
  {
    "id": "T048",
    "slug": "eudora-dress-t048",
    "name": "Eudora Dress",
    "brand": "Jolie Loft",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 180000,
    "depositPrice": 300000,
    "image": null,
    "images": []
  },
  {
    "id": "T011",
    "slug": "hana-dress-t011",
    "name": "Hana Dress",
    "brand": "Trân Ali",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 180000,
    "depositPrice": 300000,
    "image": null,
    "images": []
  },
  {
    "id": "T054",
    "slug": "ivory-dress-t054",
    "name": "Ivory Dress",
    "brand": "La Boutique",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 180000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "T128",
    "slug": "manga-dress-t128",
    "name": "Manga dress",
    "brand": "LSeoul",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 180000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "T008",
    "slug": "nini-dress-t008",
    "name": "Nini Dress",
    "brand": "H.I.U Room",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 180000,
    "depositPrice": 400000,
    "image": null,
    "images": []
  },
  {
    "id": "T138",
    "slug": "poem-set-t138",
    "name": "Poem set",
    "brand": "Amelie",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 180000,
    "depositPrice": 300000,
    "image": null,
    "images": []
  },
  {
    "id": "T074",
    "slug": "suri-dress-t074",
    "name": "Suri Dress",
    "brand": "Wonderhouse",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 180000,
    "depositPrice": 300000,
    "image": null,
    "images": []
  },
  {
    "id": "T183",
    "slug": "viola-dress-t183",
    "name": "Viola Dress",
    "brand": "Laviem",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 180000,
    "depositPrice": 400000,
    "image": null,
    "images": []
  },
  {
    "id": "T062",
    "slug": "dotie-dress-t062",
    "name": "Dotie Dress",
    "brand": "Amelia",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 170000,
    "depositPrice": 300000,
    "image": null,
    "images": []
  },
  {
    "id": "T188",
    "slug": "lamour-dress-t188",
    "name": "Lamour dress",
    "brand": "Dressesinsilk",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 170000,
    "depositPrice": 400000,
    "image": null,
    "images": []
  },
  {
    "id": "T083",
    "slug": "violet-white-dress-t083",
    "name": "Violet white dress",
    "brand": "Wonderhouse",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 170000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "T115",
    "slug": "baifern-dress-t115",
    "name": "Baifern dress",
    "brand": null,
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 160000,
    "depositPrice": 300000,
    "image": null,
    "images": []
  },
  {
    "id": "T105",
    "slug": "lanie-dress-nau-choco-t105",
    "name": "Lanie dress (nâu choco)",
    "brand": null,
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 160000,
    "depositPrice": 300000,
    "image": null,
    "images": []
  },
  {
    "id": "T119",
    "slug": "lilbea-dress-t119",
    "name": "Lilbea dress",
    "brand": "Dressesinsilk",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 160000,
    "depositPrice": 400000,
    "image": null,
    "images": []
  },
  {
    "id": "T111",
    "slug": "minty-dress-hong-t111",
    "name": "Minty dress (hồng)",
    "brand": null,
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 160000,
    "depositPrice": 300000,
    "image": null,
    "images": []
  },
  {
    "id": "T108",
    "slug": "minty-dress-xanh-la-t108",
    "name": "Minty dress (xanh lá)",
    "brand": null,
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 160000,
    "depositPrice": 300000,
    "image": null,
    "images": []
  },
  {
    "id": "T130",
    "slug": "summer-set-t130",
    "name": "Summer set",
    "brand": "Tyclothing",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 160000,
    "depositPrice": 300000,
    "image": null,
    "images": []
  },
  {
    "id": "T106",
    "slug": "vieni-dress-do-ruou-t106",
    "name": "Vieni dress (đỏ rượu)",
    "brand": "Dressesinsilk",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 160000,
    "depositPrice": 300000,
    "image": null,
    "images": []
  },
  {
    "id": "T114",
    "slug": "vieni-dress-nau-bi-do-t114",
    "name": "Vieni dress (nâu bi đỏ)",
    "brand": "Dressesinsilk",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 160000,
    "depositPrice": 300000,
    "image": null,
    "images": []
  },
  {
    "id": "T150",
    "slug": "vieni-dress-vang-nhat-t150",
    "name": "Vieni dress (vàng nhạt)",
    "brand": "Dressesinsilk",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 160000,
    "depositPrice": 300000,
    "image": null,
    "images": []
  },
  {
    "id": "T107",
    "slug": "vieni-dress-xanh-than-t107",
    "name": "Vieni dress (xanh than)",
    "brand": "Dressesinsilk",
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 160000,
    "depositPrice": 300000,
    "image": null,
    "images": []
  },
  {
    "id": "AD030",
    "slug": "ad48-ha-vy-ad030",
    "name": "AD48 Hạ Vy",
    "brand": "YM Concept",
    "sizes": [
      "L"
    ],
    "category": "ao-dai",
    "rentPrice": 150000,
    "depositPrice": 300000,
    "image": null,
    "images": []
  },
  {
    "id": "AD008",
    "slug": "ad63-minh-chau-hong-ad008",
    "name": "AD63 Minh Châu hồng",
    "brand": "Havana",
    "sizes": [
      "M"
    ],
    "category": "ao-dai",
    "rentPrice": 150000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD061",
    "slug": "ad83-van-tich-ad061",
    "name": "AD83 Vân Tịch",
    "brand": "YM Concept",
    "sizes": [
      "M"
    ],
    "category": "ao-dai",
    "rentPrice": 150000,
    "depositPrice": 300000,
    "image": null,
    "images": []
  },
  {
    "id": "T100",
    "slug": "black-swan-dress-t100",
    "name": "Black swan dress",
    "brand": null,
    "sizes": [
      "L"
    ],
    "category": "dam-vay",
    "rentPrice": 150000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "T136",
    "slug": "dam-trang-2-day-2-no-t136",
    "name": "Đầm trắng 2 dây 2 nơ",
    "brand": "Cira boutique",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 150000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "T081",
    "slug": "mermaid-dress-t081",
    "name": "Mermaid dress",
    "brand": null,
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 150000,
    "depositPrice": 300000,
    "image": null,
    "images": []
  },
  {
    "id": "T014",
    "slug": "sienna-dress-t014",
    "name": "Sienna Dress",
    "brand": "Guvie",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 150000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "T131",
    "slug": "yem-cam-co-hoa-t131",
    "name": "Yếm cam có hoa",
    "brand": "Rubies",
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 150000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "T142",
    "slug": "amber-set-t142",
    "name": "Amber set",
    "brand": "Aguja",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 140000,
    "depositPrice": 250000,
    "image": null,
    "images": []
  },
  {
    "id": "T020",
    "slug": "cocosin-den-t020",
    "name": "Cocosin đen",
    "brand": null,
    "sizes": [
      "S"
    ],
    "category": "dam-vay",
    "rentPrice": 120000,
    "depositPrice": 300000,
    "image": null,
    "images": []
  },
  {
    "id": "T069",
    "slug": "cocosin-nau-t069",
    "name": "Cocosin nâu",
    "brand": null,
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 120000,
    "depositPrice": 300000,
    "image": null,
    "images": []
  },
  {
    "id": "T072",
    "slug": "cup-nguc-den-day-t072",
    "name": "Cúp ngực đen dây",
    "brand": "Onomade",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 120000,
    "depositPrice": 300000,
    "image": null,
    "images": []
  },
  {
    "id": "T070",
    "slug": "dam-hai-day-do-t070",
    "name": "Đầm hai dây đỏ",
    "brand": "Jubin Studio",
    "sizes": [
      "M"
    ],
    "category": "dam-vay",
    "rentPrice": 120000,
    "depositPrice": 300000,
    "image": null,
    "images": []
  },
  {
    "id": "AD023",
    "slug": "ad11-khoi-cam-hong-ad023",
    "name": "AD11 Khởi Cầm Hồng",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD007",
    "slug": "ad12-hong-gam-ad007",
    "name": "AD12 Hồng gấm",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD013",
    "slug": "ad15-han-du-ad013",
    "name": "AD15 Hàn Dũ",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "T201",
    "slug": "ad19-t201",
    "name": "AD19",
    "brand": null,
    "sizes": [],
    "category": "dam-vay",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD017",
    "slug": "ad2-khoi-cam-do-ad017",
    "name": "AD2 Khởi Cầm Đỏ",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD025",
    "slug": "ad20-wayo-trang-ad025",
    "name": "AD20 Wayo Trắng",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD027",
    "slug": "ad21-charme-ad027",
    "name": "AD21 Charme",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD029",
    "slug": "ad22-wayo-xanh-ad029",
    "name": "AD22 Wayo Xanh",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD031",
    "slug": "ad24-bach-van-ad031",
    "name": "AD24 Bạch Vân",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD033",
    "slug": "ad25-chau-sa-ad033",
    "name": "AD25 Châu Sa",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD014",
    "slug": "ad26-yen-dung-do-ad014",
    "name": "AD26 Yên Dung đỏ",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD035",
    "slug": "ad28-bach-vu-kem-ad035",
    "name": "AD28 Bạch Vũ Kem",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD037",
    "slug": "ad29-co-uyen-vang-ad037",
    "name": "AD29 Cơ Uyển Vàng",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD002",
    "slug": "ad30-son-ca-ad002",
    "name": "AD30 Sơn Ca",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD039",
    "slug": "ad31-yen-dung-xanh-ad039",
    "name": "AD31 Yên Dung Xanh",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD041",
    "slug": "ad33-co-uyen-kem-ad041",
    "name": "AD33 Cơ Uyển Kem",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD009",
    "slug": "ad34-co-uyen-hong-ad009",
    "name": "AD34 Cơ Uyển Hồng",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD001",
    "slug": "ad35-thuy-nhu-ad001",
    "name": "AD35 Thủy Nhu",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD043",
    "slug": "ad36-han-du-do-ad043",
    "name": "AD36 Hân Dư Đỏ",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD016",
    "slug": "ad37-duong-dao-do-ad016",
    "name": "AD37 Đường Dao đỏ",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD012",
    "slug": "ad38-nha-xuyen-ad012",
    "name": "AD38 Nhã Xuyên",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD019",
    "slug": "ad4-vu-gia-do-ad019",
    "name": "AD4 Vũ Gia Đỏ",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD018",
    "slug": "ad40-du-mien-vang-ad018",
    "name": "AD40 Du Miên vàng",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD020",
    "slug": "ad41-thuy-nhu-vang-ad020",
    "name": "AD41 Thuỷ Nhu vàng",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD022",
    "slug": "ad42-tho-doi-trang-ad022",
    "name": "AD42 Thọ Dơi trắng",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD024",
    "slug": "ad43-yen-dung-trang-ad024",
    "name": "AD43 Yên Dung trắng",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD004",
    "slug": "ad44-moc-tra-ad004",
    "name": "AD44 Mộc Trà",
    "brand": "Havana",
    "sizes": [],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD026",
    "slug": "ad45-yem-to-vang-ad026",
    "name": "AD45 Yếm Tơ vàng",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD028",
    "slug": "ad47-to-hac-ad028",
    "name": "AD47 Tơ Hạc",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD032",
    "slug": "ad49-yem-to-hong-ad032",
    "name": "AD49 Yếm Tơ hồng",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD034",
    "slug": "ad51-moc-lam-hong-ad034",
    "name": "AD51 Mộc Lam hồng",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD036",
    "slug": "ad51-moc-lam-tim-ad036",
    "name": "AD51 Mộc Lam tím",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD038",
    "slug": "ad52-tam-giao-be-ad038",
    "name": "AD52 Tâm Giao be",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD005",
    "slug": "ad53-tam-giao-hong-ad005",
    "name": "AD53 Tâm Giao Hồng",
    "brand": "Havana",
    "sizes": [
      "M"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD003",
    "slug": "ad55-du-mien-hong-ad003",
    "name": "AD55 Du miên hồng",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD040",
    "slug": "ad56-ha-chi-ad040",
    "name": "AD56 Hạ Chi",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD060",
    "slug": "ad58-dien-y-ad060",
    "name": "AD58 Diên Ý",
    "brand": null,
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD044",
    "slug": "ad59-du-mien-do-ad044",
    "name": "AD59 Du Miên Đỏ",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD010",
    "slug": "ad61-tho-doi-hong-ad010",
    "name": "AD61 Thọ dơi hồng",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD015",
    "slug": "ad62-thien-huong-ad015",
    "name": "AD62 Thiên Hương",
    "brand": "Havana",
    "sizes": [
      "L"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD045",
    "slug": "ad64-minh-chau-be-ad045",
    "name": "AD64 Minh Châu Be",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD046",
    "slug": "ad65-truc-anh-trang-ad046",
    "name": "AD65 Trúc Anh Trắng",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD006",
    "slug": "ad66-truc-lam-ad006",
    "name": "AD66 Trúc Lam",
    "brand": "Havana",
    "sizes": [
      "S"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD047",
    "slug": "ad67-minh-chau-xanh-ad047",
    "name": "AD67 Minh Châu Xanh",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD048",
    "slug": "ad68-truc-lam-xanh-ad048",
    "name": "AD68 Trúc Lam Xanh",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD049",
    "slug": "ad69-tam-giao-xanh-ad049",
    "name": "AD69 Tâm Giao Xanh",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD011",
    "slug": "ad70-nhu-y-hong-ad011",
    "name": "AD70 Như Ý hồng",
    "brand": "Havana",
    "sizes": [
      "L"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD050",
    "slug": "ad71-nhu-y-hong-ad050",
    "name": "AD71 Như Ý Hồng",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD051",
    "slug": "ad72-moc-lam-hong-ad051",
    "name": "AD72 Mộc Lam Hồng",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD052",
    "slug": "ad73-ngoc-diep-ad052",
    "name": "AD73 Ngọc Diệp",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD053",
    "slug": "ad74-kim-dung-do-ad053",
    "name": "AD74 Kim Dung Đỏ",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD054",
    "slug": "ad76-kha-ai-ad054",
    "name": "AD76 Khả Ái",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD055",
    "slug": "ad77-chau-hoa-ad055",
    "name": "AD77 Châu Hoa",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "AD021",
    "slug": "ad8-rimmy-ad021",
    "name": "AD8 Rimmy",
    "brand": "Havana",
    "sizes": [
      "Freesize"
    ],
    "category": "ao-dai",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "PP008",
    "slug": "pp08-huong-lien-m-pp008",
    "name": "PP08 Hương Liên M",
    "brand": null,
    "sizes": [
      "M"
    ],
    "category": "phap-phuc",
    "rentPrice": 100000,
    "depositPrice": 200000,
    "image": null,
    "images": []
  },
  {
    "id": "PK01",
    "slug": "phu-kien-le-pk01",
    "name": "Phụ kiện lẻ",
    "brand": "Chỉ phụ kiện lẻ",
    "sizes": [],
    "category": "dam-vay",
    "rentPrice": 0,
    "depositPrice": 0,
    "image": null,
    "images": []
  }
];
