
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
    toilet_num?: number, // => '卫生间数量',
    kitchen_num?: number, // => '厨房数量',
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
    level10?: string, // => 'Level1number',
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
    rm1_len?: number, // => 'Rm1 Len',
    rm1_wth?: number, // => 'Rm1 Wth',
    rm10_out?: string, // => 'rm10 Out',
    rm10_dc1_out?: string, // => 'rm10 Dc1 Out',
    rm10_dc2_out?: string, // => 'rm10 Dc2 Out',
    rm10_dc3_out?: string, // => 'rm10 Dc3 Out',
    rm10_wth?: number, // => 'rm10 Wth',
    rm11_out?: string, // => 'Rm11 Out',
    rm11_dc1_out?: string, // => 'Rm11 Dc1 Out',
    rm11_dc2_out?: string, // => 'Rm11 Dc2 Out',
    rm11_dc3_out?: string, // => 'Rm11 Dc3 Out',
    rm10_len?: number, // => 'rm10 Len',
    rm11_len?: number, // => 'Rm11 Len',
    rm11_wth?: number, // => 'Rm11 Wth',
    rm12_out?: string, // => 'Rm12 Out',
    rm12_dc1_out?: string, // => 'Rm12 Dc1 Out',
    rm12_dc3_out?: string, // => 'Rm12 Dc3 Out',
    rm12_len?: number, // => 'Rm12 Len',
    rm12_wth?: number, // => 'Rm12 Wth',
    rm2_out?: string, // => 'Rm2 Out',
    rm2_dc1_out?: string, // => 'Rm2 Dc1 Out',
    rm2_dc2_out?: string, // => 'Rm2 Dc2 Out',
    rm2_dc3_out?: string, // => 'Rm2 Dc3 Out',
    rm2_len?: number, // => 'Rm2 Len',
    rm2_wth?: number, // => 'Rm2 Wth',
    rm3_out?: string, // => 'Rm3 Out',
    rm3_dc1_out?: string, // => 'Rm3 Dc1 Out',
    rm3_dc2_out?: string, // => 'Rm3 Dc2 Out',
    rm3_len?: number, // => 'Rm3 Len',
    rm3_wth?: number, // => 'Rm3 Wth',
    rm4_out?: string, // => 'Rm4 Out',
    rm4_dc1_out?: string, // => 'Rm4 Dc1 Out',
    rm4_dc2_out?: string, // => 'Rm4 Dc2 Out',
    rm4_dc3_out?: string, // => 'Rm4 Dc3 Out',
    rm4_len?: number, // => 'Rm4 Len',
    rm4_wth?: number, // => 'Rm4 Wth',
    rm5_out?: string, // => 'Rm5 Out',
    rm5_dc1_out?: string, // => 'Rm5 Dc1 Out',
    rm5_dc2_out?: string, // => 'Rm5 Dc2 Out',
    rm5_dc3_out?: string, // => 'Rm5 Dc3 Out',
    rm5_len?: number, // => 'Rm5 Len',
    rm5_wth?: number, // => 'Rm5 Wth',
    rm6_out?: string, // => 'Rm6 Out',
    rm6_dc1_out?: string, // => 'Rm6 Dc1 Out',
    rm6_dc2_out?: string, // => 'Rm6 Dc2 Out',
    rm6_dc3_out?: string, // => 'Rm6 Dc3 Out',
    rm6_len?: number, // => 'Rm6 Len',
    rm6_wth?: number, // => 'Rm6 Wth',
    rm7_out?: string, // => 'Rm7 Out',
    rm7_dc1_out?: string, // => 'Rm7 Dc1 Out',
    rm7_dc2_out?: string, // => 'Rm7 Dc2 Out',
    rm7_dc3_out?: string, // => 'Rm7 Dc3 Out',
    rm7_len?: number, // => 'Rm7 Len',
    rm7_wth?: number, // => 'Rm7 Wth',
    rm8_out?: string, // => 'Rm8 Out',
    rm8_dc1_out?: string, // => 'Rm8 Dc1 Out',
    rm8_dc2_out?: string, // => 'Rm8 Dc2 Out',
    rm8_dc3_out?: string, // => 'Rm8 Dc3 Out',
    rm8_len?: number, // => 'Rm8 Len',
    rm8_wth?: number, // => 'Rm8 Wth',
    rm9_out?: string, // => 'Rm9 Out',
    rm9_dc1_out?: string, // => 'Rm9 Dc1 Out',
    rm9_dc2_out?: string, // => 'Rm9 Dc2 Out',
    rm9_dc3_out?: string, // => 'Rm9 Dc3 Out',
    rm9_len?: number, // => 'Rm9 Len',
    rm9_wth?: number, // => 'Rm9 Wth',
    rms?: number, // => 'Rms',
    rooms_plus?: number, // => 'Rooms Plus',
    s_r?: string, // => 'S R',
    style?: string, // => 'Style',
    yr?: string, // => 'Yr',
    type_own1_out?: string, // => 'Type Own1 Out',
    tour_url?: string, // => 'Tour Url',
    bath_tot?: number, // => 'Bath Tot',
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
    pic_num?: number,
    src?: string
};

export class houseModel {

    //init house default object
    public house: houseInterface = {
        id: '',  // => 'ID',
        name: '', // => '名称',
        prepay: '', // => '首付',
        total_price: '', // => '总价',
        subject_id: '', // => '所属项目',
        accessDate: '', // => '挂牌时间',
        location: '', // => '地址',
        introduction: '', // => '描述',
        house_image: '', // => '房源图片',
        image_list: '', // => '组图',
        video_url: '', // => '房源视频路径',
        author: '', // => '作者',
        recommend: '', // => '是否推荐',
        city_id: 0, // => '城市',
        district_id: '', // => '地区',
        community: '', // => '社区',
        investType_id: 0, // => '投资类型',
        propertyType_id: '', // => '物业类型',
        land_area: 0, // => '土地面积',
        house_area: 0, // => '房屋面积',
        floor_num: '', // => '房屋层数',
        house_style: '', // => '房屋层数',
        bedroom_num: '', // => '卧室数量',
        toilet_num: 0, // => '卫生间数量',
        kitchen_num: 0, // => '厨房数量',
        park_num: '', // => '停车位数量',
        house_size: '', // => '房屋规格',
        door_direction: '', // => '大门朝向',
        construction_year: '', // => '建造年份',
        zipcode: '', // => '邮编',
        certificate: '', // => '认证房源',
        lift: '', // => '电梯',
        carport: '', // => '车库',
        embassy: '', // => '会客厅',
        mls_code: '', // => 'MLS编号',
        facilities: '', // => '附近设施',
        longitude: 0, // => '经度',
        latitude: 0, // => '纬度',
        match: '', // => '配套设施',
        is_sell: '', // => '是否售卖',
        a_c: '', // => '是否中央空调',
        central_vac: '', // => '是否中央吸尘',
        gar_space: '', // => '是否配套家具',
        basement: '', // => '是否地下室',
        pool: '', // => '是否游泳池',
        fireplace_stove: '', // => '是否壁炉',
        taxes: '', // => '地税',
        tax_year: '', // => '地税年度',
        cross_streets: '', // => '交叉路口',
        heat: '', // => '暖气',
        mls_province: '', // => 'mls省份',
        mls_area: '', // => 'mls地区',
        mls_area_code: '', // => 'mls地区code',
        mls_municipality: '', // => 'mls城市',
        mls_municp_code: '', // => 'mls城市code',
        yr_built: '', // => 'Yr Built',
        sqft: '', // => 'Sqft',
        area: '', // => 'Area',
        area_code: '', // => 'Area Code',
        bsmt1_out: '', // => 'Bsmt1 Out',
        bsmt2_out: '', // => 'Bsmt2 Out',
        br: 0, // => 'Br',
        br_plus: 0, // => 'Br Plus',
        community_c: '', // => 'Community C',
        cross_st: '', // => 'Cross St',
        elevator: '', // => 'Elevator',
        constr1_out: '', // => 'Constr1 Out',
        constr2_out: '', // => 'Constr2 Out',
        extras: '', // => 'Extras',
        fpl_num: '', // => 'Fpl Num',
        comp_pts: '', // => 'Comp Pts',
        furnished: '', // => 'Furnished',
        fuel: '', // => 'Fuel',
        heating: '', // => 'Heating',
        num_kit: 0, // => 'Num Kit',
        kit_plus: 0, // => 'Kit Plus',
        level1: '', // => 'Level1',
        level10: '', // => 'Level10',
        level11: '', // => 'Level11',
        level12: '', // => 'Level12',
        level2: '', // => 'Level2',
        level3: '', // => 'Level3',
        level4: '', // => 'Level4',
        level5: '', // => 'Level5',
        level6: '', // => 'Level6',
        level7: '', // => 'Level7',
        level8: '', // => 'Level8',
        level9: '', // => 'Level9',
        lp_dol: 0, // => 'Lp Dol',
        depth: '', // => 'Depth',
        front_ft: '', // => 'Front Ft',
        lotsz_code: '', // => 'Lotsz Code',
        ml_num: '', // => 'Ml Num',
        municipality: '', // => 'Municipality',
        municipality_code: '', // => 'Municipality Code',
        pix_updt: '', // => 'Pix Updt',
        zip: '', // => 'Zip',
        prop_feat1_out: '', // => 'Prop Feat1 Out',
        prop_feat2_out: '', // => 'Prop Feat2 Out',
        prop_feat3_out: '', // => 'Prop Feat3 Out',
        prop_feat4_out: '', // => 'Prop Feat4 Out',
        prop_feat5_out: '', // => 'Prop Feat5 Out',
        prop_feat6_out: '', // => 'Prop Feat6 Out',
        county: '', // => 'County',
        ad_text: '', // => 'Ad Text',
        rm1_out: '', // => 'Rm1 Out',
        rm1_dc1_out: '', // => 'Rm1 Dc1 Out',
        rm1_dc2_out: '', // => 'Rm1 Dc2 Out',
        rm1_dc3_out: '', // => 'Rm1 Dc3 Out',
        rm1_len: 0, // => 'Rm1 Len',
        rm1_wth: 0, // => 'Rm1 Wth',
        rm10_out: '', // => 'Rm10 Out',
        rm10_dc1_out: '', // => 'Rm10 Dc1 Out',
        rm10_dc2_out: '', // => 'Rm10 Dc2 Out',
        rm10_dc3_out: '', // => 'Rm10 Dc3 Out',
        rm10_wth: 0, // => 'Rm10 Wth',
        rm11_out: '', // => 'Rm11 Out',
        rm11_dc1_out: '', // => 'Rm11 Dc1 Out',
        rm11_dc2_out: '', // => 'Rm11 Dc2 Out',
        rm11_dc3_out: '', // => 'Rm11 Dc3 Out',
        rm10_len: 0, // => 'Rm10 Len',
        rm11_len: 0, // => 'Rm11 Len',
        rm11_wth: 0, // => 'Rm11 Wth',
        rm12_out: '', // => 'Rm12 Out',
        rm12_dc1_out: '', // => 'Rm12 Dc1 Out',
        rm12_dc3_out: '', // => 'Rm12 Dc3 Out',
        rm12_len: 0, // => 'Rm12 Len',
        rm12_wth: 0, // => 'Rm12 Wth',
        rm2_out: '', // => 'Rm2 Out',
        rm2_dc1_out: '', // => 'Rm2 Dc1 Out',
        rm2_dc2_out: '', // => 'Rm2 Dc2 Out',
        rm2_dc3_out: '', // => 'Rm2 Dc3 Out',
        rm2_len: 0, // => 'Rm2 Len',
        rm2_wth: 0, // => 'Rm2 Wth',
        rm3_out: '', // => 'Rm3 Out',
        rm3_dc1_out: '', // => 'Rm3 Dc1 Out',
        rm3_dc2_out: '', // => 'Rm3 Dc2 Out',
        rm3_len: 0, // => 'Rm3 Len',
        rm3_wth: 0, // => 'Rm3 Wth',
        rm4_out: '', // => 'Rm4 Out',
        rm4_dc1_out: '', // => 'Rm4 Dc1 Out',
        rm4_dc2_out: '', // => 'Rm4 Dc2 Out',
        rm4_dc3_out: '', // => 'Rm4 Dc3 Out',
        rm4_len: 0, // => 'Rm4 Len',
        rm4_wth: 0, // => 'Rm4 Wth',
        rm5_out: '', // => 'Rm5 Out',
        rm5_dc1_out: '', // => 'Rm5 Dc1 Out',
        rm5_dc2_out: '', // => 'Rm5 Dc2 Out',
        rm5_dc3_out: '', // => 'Rm5 Dc3 Out',
        rm5_len: 0, // => 'Rm5 Len',
        rm5_wth: 0, // => 'Rm5 Wth',
        rm6_out: '', // => 'Rm6 Out',
        rm6_dc1_out: '', // => 'Rm6 Dc1 Out',
        rm6_dc2_out: '', // => 'Rm6 Dc2 Out',
        rm6_dc3_out: '', // => 'Rm6 Dc3 Out',
        rm6_len: 0, // => 'Rm6 Len',
        rm6_wth: 0, // => 'Rm6 Wth',
        rm7_out: '', // => 'Rm7 Out',
        rm7_dc1_out: '', // => 'Rm7 Dc1 Out',
        rm7_dc2_out: '', // => 'Rm7 Dc2 Out',
        rm7_dc3_out: '', // => 'Rm7 Dc3 Out',
        rm7_len: 0, // => 'Rm7 Len',
        rm7_wth: 0, // => 'Rm7 Wth',
        rm8_out: '', // => 'Rm8 Out',
        rm8_dc1_out: '', // => 'Rm8 Dc1 Out',
        rm8_dc2_out: '', // => 'Rm8 Dc2 Out',
        rm8_dc3_out: '', // => 'Rm8 Dc3 Out',
        rm8_len: 0, // => 'Rm8 Len',
        rm8_wth: 0, // => 'Rm8 Wth',
        rm9_out: '', // => 'Rm9 Out',
        rm9_dc1_out: '', // => 'Rm9 Dc1 Out',
        rm9_dc2_out: '', // => 'Rm9 Dc2 Out',
        rm9_dc3_out: '', // => 'Rm9 Dc3 Out',
        rm9_len: 0, // => 'Rm9 Len',
        rm9_wth: 0, // => 'Rm9 Wth',
        rms: 0, // => 'Rms',
        rooms_plus: 0, // => 'Rooms Plus',
        s_r: '', // => 'S R',
        style: '', // => 'Style',
        yr: '', // => 'Yr',
        type_own1_out: '', // => 'Type Own1 Out',
        tour_url: '', // => 'Tour Url',
        bath_tot: 0, // => 'Bath Tot',
        addr: '', // => 'Addr',
        community_code: '', // => 'Community Code',
        rm12_dc2_out: '', // => 'Rm12 Dc2 Out',
        rm3_dc3_out: '', // => 'Rm3 Dc3 Out',
        acres: '', // => 'Acres',
        apt_num: '',
        orig_dol: 0,
        oh_date1: '',
        oh_date2: '',
        oh_date3: '',
        oh_from1: '',
        oh_from2: '',
        oh_from3: '',
        oh_to1: '',
        oh_to2: '',
        oh_to3: '',
        pic_num: 0,
        src: ''

    };
    public COMP_PTS = { "N": "北", "S": "南", "W": "西", "E": "东" };
    public S_R = { "Sale": "出售", "Lease": "出租" };
    public F2M = { feet: "尺", meter: "米", sfeet: "平方英尺", smeter: "平方米" };
    public rooms = [];
    public rxPhone: string;
    //private auth: boolean
    public houseMname;
    public exchangeRate;
    public cdnPhotos: Array<string>;
    public housePropertyType;
    public houseProvince;
    public landArea: string;
    public propertyTxt: string;
    public addr: string;
    public priceCurrent: string;
    public priceOrig: string;
    public priceRMB: number;
    public kit: number;
    public beds: number;
    public rms: number;
    public listDate;
    //public isFav;

    constructor() {

    }
    setProperties(auth: boolean,fzm: boolean){
         
        this.getLandArea(fzm);
        this.houseRooms(fzm);
        this.getAddr();
        //this.getPriceTxt(this.house.)
        this.priceCurrent =this.getPriceTxt(this.house.lp_dol);
        this.priceOrig = this.getPriceTxt(this.house.orig_dol);
        this.kit = this.add2(this.house.num_kit,this.house.kit_plus);
        this.beds = this.add2(this.house.br,this.house.br_plus);
        this.rms = this.add2(this.house.rms,this.house.rooms_plus);
        this.priceRMB = this.getPriceRMB(this.house.lp_dol);
        this.getListDays();
        this.getPropertyTxt();
        
    }


  getListDays() { // yyyy-mm-dd
    let date1:any = new Date(this.house.pix_updt);
    let date2:any = new Date();
    let diffdays = Math.floor((date2 - date1) / (1000*60*60*24));
    this.listDate = diffdays + "天";
    return diffdays + "天";
  }

    add2(int1, int2) {
        
        return parseInt(int1, 10) + parseInt(int2, 10);
    }

    round1(num) {
        return +(Math.round(+(num + "e+1")) + "e-1");
    }

    round2(num) {
        return +(Math.round(+(num + "e+2")) + "e-2");
    }


    houseRooms(s: boolean) {

        if (s == true) {  //meter

            this.rooms = [];
            for (let i = 1; i < 12; i++) {
                let o = {
                    level: this.house["level" + i],
                    out: this.house['rm' + i + '_out'],
                    len: this.house['rm' + i + '_len'],
                    wth: this.house['rm' + i + '_wth'],
                    area: this.round1(this.house['rm' + i + '_len'] * this.house['rm' + i + '_wth']),
                    desc: this.getRoomDesc(this.house['rm' + i + '_dc1_out'], this.house['rm' + i + '_dc2_out'], this.house['rm' + i + '_dc3_out'])
                };

                this.rooms.push(o);
            }


        } else {  //feet
            this.rooms = [];
            for (let i = 1; i < 12; i++) {
                let o = {
                    level: this.house["level" + i],
                    out: this.house['rm' + i + '_out'],
                    len: this.round1(this.house['rm' + i + '_len']*3.3),
                    wth: this.round1(this.house['rm' + i + '_wth']*3.3),
                    area: this.round1(this.round1(this.house['rm' + i + '_len'] * this.house['rm' + i + '_wth']) * 3.3 *3.3),
                    desc: this.getRoomDesc(this.house['rm' + i + '_dc1_out'], this.house['rm' + i + '_dc2_out'], this.house['rm' + i + '_dc3_out'])
                };

                this.rooms.push(o);
            }

        }


        return this.rooms;
    }

    getPriceTxt(price: number) {
        let priceTxt;
        if (this.house.s_r == "Sale")
            priceTxt = Number(price) / 10000 + "万加币";
        else
            priceTxt = price + "加元/月";
        return priceTxt;
    }

    getPriceRMB(price: number) {
        return this.round2(price * this.exchangeRate / 10000);
    }

    getPropertyTxt() {
        //console.log("get property")
        let propertyTxt = this.house.prop_feat1_out;

        if (this.house.prop_feat2_out)
            propertyTxt = propertyTxt + " , " + this.house.prop_feat2_out;
        if (this.house.prop_feat3_out)
            propertyTxt = propertyTxt + " , " + this.house.prop_feat3_out;
        if (this.house.prop_feat4_out)
            propertyTxt = propertyTxt + " , " + this.house.prop_feat4_out;
        if (this.house.prop_feat5_out)
            propertyTxt = propertyTxt + " , " + this.house.prop_feat5_out;
        if (this.house.prop_feat6_out)
            propertyTxt = propertyTxt + " , " + this.house.prop_feat6_out;

        this.propertyTxt = propertyTxt  
        return propertyTxt;
    }

    getRoomDesc(dc1, dc2, dc3) {
        let roomDesc = dc1;

        if (dc2) roomDesc = roomDesc + " , " + dc2;
        if (dc3) roomDesc = roomDesc + " , " + dc3;

        return roomDesc;
    }

    getLandArea(switchF2M: boolean) {
        console.log("get land size")
        if (switchF2M)
           // return this.round2(this.house.land_area * 0.09290304) + this.F2M.smeter;
           this.landArea = this.round2(this.house.land_area * 0.09290304) + this.F2M.smeter;

        else
            //return this.house.land_area + this.F2M.sfeet;
            this.landArea = this.house.land_area + this.F2M.sfeet;
    }

    getAddr() {
        let txt = this.house.addr;
        if (this.house.apt_num) txt = this.house.apt_num + '-' + this.house.addr;
        this.addr = txt;
        return txt;
    }

    hasOpenHouse(oh_dt, auth: boolean) {
       
        if (auth){
           
             return (oh_dt && oh_dt != '0000-00-00') ? true : false;
         
        }
         
        else
            return false;
    }

    getOpenHouse(oh_dt, oh_from, oh_to) {
        let txt = '';
        if (oh_dt && oh_dt != '0000-00-00') txt = oh_dt + ' ' + oh_from + '-' + oh_to;
        return txt;
    }



}