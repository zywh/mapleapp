
export interface houseInterface {
    id?: string,  // => 'ID',
    name?: string, // => '名称',
    prepay?: string, // => '首付',
    total_price?: string, // => '总价',
    subject_id?: string, // => '所属项目',
    accessDate?: string, // => '挂牌时间',
    location?: string, // => '地址',
    introduction?: string, // => '描述',
    house_image?: string, // => '房源图片',
    image_list?: string, // => '组图',
    video_url?: string, // => '房源视频路径',
    author?: string, // => '作者',
    recommend?: string, // => '是否推荐',
    city_id?: number, // => '城市',
    district_id?: string, // => '地区',
    community?: string, // => '社区',
    investType_id?: number, // => '投资类型',
    propertyType_id?: string, // => '物业类型',
    land_area?: number, // => '土地面积',
    house_area?: number, // => '房屋面积',
    floor_num?: string, // => '房屋层数',
    house_style?: string, // => '房屋层数',
    bedroom_num?: string, // => '卧室数量',
    toilet_num?: string, // => '卫生间数量',
    kitchen_num?: string, // => '厨房数量',
    park_num?: string, // => '停车位数量',
    house_size?: string, // => '房屋规格',
    door_direction?: string, // => '大门朝向',
    construction_year?: string, // => '建造年份',
    zipcode?: string, // => '邮编',
    certificate?: string, // => '认证房源',
    lift?: string, // => '电梯',
    carport?: string, // => '车库',
    embassy?: string, // => '会客厅',
    mls_code?: string, // => 'MLS编号',
    facilities?: string, // => '附近设施',
    longitude?: number, // => '经度',
    latitude?: number, // => '纬度',
    match?: string, // => '配套设施',
    is_sell?: string, // => '是否售卖',
    a_c?: string, // => '是否中央空调',
    central_vac?: string, // => '是否中央吸尘',
    gar_space?: string, // => '是否配套家具',
    basement?: string, // => '是否地下室',
    pool?: string, // => '是否游泳池',
    fireplace_stove?: string, // => '是否壁炉',
    taxes?: string, // => '地税',
    tax_year?: string, // => '地税年度',
    cross_streets?: string, // => '交叉路口',
    heat?: string, // => '暖气',
    mls_province?: string, // => 'mls省份',
    mls_area?: string, // => 'mls地区',
    mls_area_code?: string, // => 'mls地区code',
    mls_municipality?: string, // => 'mls城市',
    mls_municp_code?: string, // => 'mls城市code',
    yr_built?: string, // => 'Yr Built',
    sqft?: string, // => 'Sqft',
    area?: string, // => 'Area',
    area_code?: string, // => 'Area Code',
    bsmt1_out?: string, // => 'Bsmt1 Out',
    bsmt2_out?: string, // => 'Bsmt2 Out',
    br?: number, // => 'Br',
    br_plus?: number, // => 'Br Plus',
    community_c?: string, // => 'Community C',
    cross_st?: string, // => 'Cross St',
    elevator?: string, // => 'Elevator',
    constr1_out?: string, // => 'Constr1 Out',
    constr2_out?: string, // => 'Constr2 Out',
    extras?: string, // => 'Extras',
    fpl_num?: string, // => 'Fpl Num',
    comp_pts?: string, // => 'Comp Pts',
    furnished?: string, // => 'Furnished',
    fuel?: string, // => 'Fuel',
    heating?: string, // => 'Heating',
    num_kit?: number, // => 'Num Kit',
    kit_plus?: number, // => 'Kit Plus',
    level1?: string, // => 'Level1',
    level1number?: string, // => 'Level1number',
    level11?: string, // => 'Level11',
    level12?: string, // => 'Level12',
    level2?: string, // => 'Level2',
    level3?: string, // => 'Level3',
    level4?: string, // => 'Level4',
    level5?: string, // => 'Level5',
    level6?: string, // => 'Level6',
    level7?: string, // => 'Level7',
    level8?: string, // => 'Level8',
    level9?: string, // => 'Level9',
    lp_dol?: number, // => 'Lp Dol',
    depth?: string, // => 'Depth',
    front_ft?: string, // => 'Front Ft',
    lotsz_code?: string, // => 'Lotsz Code',
    ml_num?: string, // => 'Ml Num',
    municipality?: string, // => 'Municipality',
    municipality_code?: string, // => 'Municipality Code',
    pix_updt?: string, // => 'Pix Updt',
    zip?: string, // => 'Zip',
    prop_feat1_out?: string, // => 'Prop Feat1 Out',
    prop_feat2_out?: string, // => 'Prop Feat2 Out',
    prop_feat3_out?: string, // => 'Prop Feat3 Out',
    prop_feat4_out?: string, // => 'Prop Feat4 Out',
    prop_feat5_out?: string, // => 'Prop Feat5 Out',
    prop_feat6_out?: string, // => 'Prop Feat6 Out',
    county?: string, // => 'County',
    ad_text?: string, // => 'Ad Text',
    rm1_out?: string, // => 'Rm1 Out',
    rm1_dc1_out?: string, // => 'Rm1 Dc1 Out',
    rm1_dc2_out?: string, // => 'Rm1 Dc2 Out',
    rm1_dc3_out?: string, // => 'Rm1 Dc3 Out',
    rm1_len?: string, // => 'Rm1 Len',
    rm1_wth?: string, // => 'Rm1 Wth',
    rm10_out?: string, // => 'rm10 Out',
    rm10_dc1_out?: string, // => 'rm10 Dc1 Out',
    rm10_dc2_out?: string, // => 'rm10 Dc2 Out',
    rm10_dc3_out?: string, // => 'rm10 Dc3 Out',
    rm10_wth?: string, // => 'rm10 Wth',
    rm11_out?: string, // => 'Rm11 Out',
    rm11_dc1_out?: string, // => 'Rm11 Dc1 Out',
    rm11_dc2_out?: string, // => 'Rm11 Dc2 Out',
    rm11_dc3_out?: string, // => 'Rm11 Dc3 Out',
    rm10_len?: string, // => 'rm10 Len',
    rm11_len?: string, // => 'Rm11 Len',
    rm11_wth?: string, // => 'Rm11 Wth',
    rm12_out?: string, // => 'Rm12 Out',
    rm12_dc1_out?: string, // => 'Rm12 Dc1 Out',
    rm12_dc3_out?: string, // => 'Rm12 Dc3 Out',
    rm12_len?: string, // => 'Rm12 Len',
    rm12_wth?: string, // => 'Rm12 Wth',
    rm2_out?: string, // => 'Rm2 Out',
    rm2_dc1_out?: string, // => 'Rm2 Dc1 Out',
    rm2_dc2_out?: string, // => 'Rm2 Dc2 Out',
    rm2_dc3_out?: string, // => 'Rm2 Dc3 Out',
    rm2_len?: string, // => 'Rm2 Len',
    rm2_wth?: string, // => 'Rm2 Wth',
    rm3_out?: string, // => 'Rm3 Out',
    rm3_dc1_out?: string, // => 'Rm3 Dc1 Out',
    rm3_dc2_out?: string, // => 'Rm3 Dc2 Out',
    rm3_len?: string, // => 'Rm3 Len',
    rm3_wth?: string, // => 'Rm3 Wth',
    rm4_out?: string, // => 'Rm4 Out',
    rm4_dc1_out?: string, // => 'Rm4 Dc1 Out',
    rm4_dc2_out?: string, // => 'Rm4 Dc2 Out',
    rm4_dc3_out?: string, // => 'Rm4 Dc3 Out',
    rm4_len?: string, // => 'Rm4 Len',
    rm4_wth?: string, // => 'Rm4 Wth',
    rm5_out?: string, // => 'Rm5 Out',
    rm5_dc1_out?: string, // => 'Rm5 Dc1 Out',
    rm5_dc2_out?: string, // => 'Rm5 Dc2 Out',
    rm5_dc3_out?: string, // => 'Rm5 Dc3 Out',
    rm5_len?: string, // => 'Rm5 Len',
    rm5_wth?: string, // => 'Rm5 Wth',
    rm6_out?: string, // => 'Rm6 Out',
    rm6_dc1_out?: string, // => 'Rm6 Dc1 Out',
    rm6_dc2_out?: string, // => 'Rm6 Dc2 Out',
    rm6_dc3_out?: string, // => 'Rm6 Dc3 Out',
    rm6_len?: string, // => 'Rm6 Len',
    rm6_wth?: string, // => 'Rm6 Wth',
    rm7_out?: string, // => 'Rm7 Out',
    rm7_dc1_out?: string, // => 'Rm7 Dc1 Out',
    rm7_dc2_out?: string, // => 'Rm7 Dc2 Out',
    rm7_dc3_out?: string, // => 'Rm7 Dc3 Out',
    rm7_len?: string, // => 'Rm7 Len',
    rm7_wth?: string, // => 'Rm7 Wth',
    rm8_out?: string, // => 'Rm8 Out',
    rm8_dc1_out?: string, // => 'Rm8 Dc1 Out',
    rm8_dc2_out?: string, // => 'Rm8 Dc2 Out',
    rm8_dc3_out?: string, // => 'Rm8 Dc3 Out',
    rm8_len?: string, // => 'Rm8 Len',
    rm8_wth?: string, // => 'Rm8 Wth',
    rm9_out?: string, // => 'Rm9 Out',
    rm9_dc1_out?: string, // => 'Rm9 Dc1 Out',
    rm9_dc2_out?: string, // => 'Rm9 Dc2 Out',
    rm9_dc3_out?: string, // => 'Rm9 Dc3 Out',
    rm9_len?: string, // => 'Rm9 Len',
    rm9_wth?: string, // => 'Rm9 Wth',
    rms?: number, // => 'Rms',
    rooms_plus?: number, // => 'Rooms Plus',
    s_r?: string, // => 'S R',
    style?: string, // => 'Style',
    yr?: string, // => 'Yr',
    type_own1_out?: string, // => 'Type Own1 Out',
    tour_url?: string, // => 'Tour Url',
    bath_tot?: string, // => 'Bath Tot',
    addr?: string, // => 'Addr',
    community_code?: string, // => 'Community Code',
    rm12_dc2_out?: string, // => 'Rm12 Dc2 Out',
    rm3_dc3_out?: string, // => 'Rm3 Dc3 Out',
    acres?: string, // => 'Acres',
    apt_num?: string,
    orig_dol?: number,
    oh_date1?: string,
    oh_date2?: string,
    oh_date3?: string,
    oh_from1?: string,
    oh_from2?: string,
    oh_from3?: string,
    oh_to1?: string,
    oh_to2?: string,
    oh_to3?: string,
    pic_num?: number
};

export class houseModel {
 public house: houseInterface;
   constructor (){

   }

}