const {Component} = React;
const {render} = ReactDOM;

const carouselContainer = document.querySelector(".carousel-container");   //锈病
const carouselContainer_heixing = document.querySelector(".carousel-container-heixingbing");  //黑星病
const carouselContainer_heban = document.querySelector(".carousel-container-hebanbing");  //褐斑病
const carouselContainer_bandianluoye = document.querySelector(".carousel-container-bandianluoyebing");  //斑点落叶病

// Data for carousel
const carouselSlidesData = [
    {
        content:
            "病原为山田胶锈菌（Gymnosporangium yamadai Miyabe），又称苹果东方胶锈菌，属担子菌亚门、冬孢菌纲、锈菌目、柄锈菌科、胶锈菌属真菌，是一种转主寄生菌，在苹果树上形成性孢子和锈孢子，在桧柏上形成冬孢子，以后萌发产生担孢子。性孢子器近圆形，埋生于表皮下。性孢子单细胞，无色，纺锤形。锈孢子器圆筒形，一般在叶背，也可长在果实上。锈孢子球形或多角形，单细胞，栗褐色，膜厚，有瘤状突起，大小为19.2-25.6微米×16.6-24.3微米。护膜细胞长梭形或长六角形，有卵圆形的乳头状突起，大小为25.3-117.5微米×16.5-25.9微米。冬孢子双细胞，无色，具长柄，卵圆形或椭圆形，分隔处稍缢缩，暗褐色，大小为32.6-53.7微米×20.5-25.6微米。冬孢子的两个细胞各具有2个发芽孔，萌发时长出有分隔的担子，4个细胞，每胞上生1个小梗，顶端着生1个担孢子。担孢子卵形，淡黄褐色，单细胞，大小为13-16微米×7.5-9微米。该病菌除为害苹果外，还能为害沙果、山定子、海棠等。该菌是一种转主寄生菌，它的转主寄主除桧柏外，还包括高塔柏、新疆圆柏、欧洲刺柏、希腊桧、矮桧、翠柏及龙柏等。",
        author: "病原特征",
        source: "苹果锈病"
    },
    {
        content:
            "苹果锈病主要为害叶片，也能为害嫩枝、幼果和果柄，还可为害转主寄主桧柏。叶片初患病正面出现油亮的橘红色小斑点，逐渐扩大，形成圆形橙黄色的病斑，边缘红色。发病严重时，一张叶片出现几十个病斑。发病1-2周后，病斑表面密生鲜黄色细小点粒，即性孢子器。叶柄发病，病部橙黄色，稍隆起，多呈纺锤形，初期表面产生小点状性孢子器，后期病斑周围产生毛状的锈孢子器。新梢发病，刚开始与叶柄受害相似，后期病部凹陷、龟裂、易折断。幼果染病后，靠近萼洼附近的果面上出现近圆形病斑，初为橙黄色，后变黄褐色，直径约10-20毫米。病斑表面也产生初为黄色、后变为黑色的小点粒，其后在病斑四周产生细管状的锈孢子器，病果生长停滞，病部坚硬，多呈畸形。嫩枝发病，病斑为橙黄色，梭形，局部隆起，后期病部龟裂。病枝易从病部折断。",
        author: "危害症状",
        source: "苹果锈病"
    },
    {
        content:
            "苹果锈病菌侵染桧柏小枝后，形成菌瘙，以菌丝体越冬。翌年降雨后菌瘿中涌出冬孢子角。冬孢子萌发生成小孢子—担孢子，又随风飞传播到苹果树上，侵入叶、果或嫩梢，先后形成性孢子器及锈孢子器。该锈菌生活史中少夏孢子阶段，一年中只发生一次侵染。锈孢子成熟后，随风传播到桧柏上，侵入小枝形成菌瘿，是病菌生活在桧柏上进行轮循环。",
        author: "侵染循环",
        source: "苹果锈病"
    },
    {
        content:
            "苹果锈病的流行与早春的气候密切相关，降雨频繁，气温较高易诱发此病流行。相反，春天干燥，虽降雨偏多，气温较低则发病较轻。",
        author: "流行规律",
        source: "苹果锈病"
    },
    {
        content:
            "1.铲除桧柏苹果产区禁止种植桧柏。风景旅游区有桧柏的地方，不宜发展苹果园，两者应相距至少5千米以上；已零星种植桧柏的建议将其从果园中移走，防止苹果锈病的发生。" +
            "2.桧柏春季防治冬春检查菌瘿及“胶花”是否出现，发现后及时剪除，集中销毁。苹果发芽至幼果拇指盖大小时，在桧柏树上喷1-2度石硫合剂，全树喷药1-2次。",
        author: "防治方法-农业防治",
        source: "苹果锈病"
    },
    {
        content:
            "喷药保护：从苹果展叶期开始，每隔10-15天喷布一次杀菌剂，连喷2-3次，保护叶片不受锈病菌侵染；或在大范围降水前，喷布1次杀菌剂，防止锈病菌在降雨过程中侵染。",
        author: "防治方法-化学防治",
        source: "苹果锈病"
    }];

const carouselSlidesData_heixing = [
    {
        content:
            "病原为苹果黑星菌，属子囊菌亚门真菌。病菌有生理分化现象，不同地区、不同苹果品种上的主要致病菌类型，可能不同。无性世代为苹果环黑星孢和树状黑星孢，均属半知菌亚门真菌。",
        author: "病原特性",
        source: "苹果黑星病"
    },
    {
        content:
            "苹果黑星病主要危害叶片或果实，叶柄、果柄、花芽、花器及新梢，从落花期到苹果成熟期均可危害。" +
            "枝干：在枝端十几厘米以内的部位产生黑褐色长椭圆形病斑，枝条长大时病斑会消失。在特别感病品种上，形成泡肿状。" +
            "叶片：病斑最早从叶片正面产生，先为淡黄的圆形或放射状，3-5毫米，色泽较周围组织深，后渐变为褐色，最后为黑色，上有一层黑色霉状物。幼嫩叶片发病较重时，叶形变小、叶片增厚，呈卷曲或扭曲状。随着叶片老化，病斑周围的健全组织增厚使病斑向上凸出黑色边缘明显，其背面呈环状凹入。叶柄上病斑呈长条形。" +
            "花器：花瓣褪色，萼片尖端呈灰色，因有绒毛覆盖，不宜被察觉。花梗变黑色，发病圈时花脱落。" +
            "果实：在果肩或胴部产生黄绿色小斑点，后变成黑褐色或黑色病斑，呈圆形或椭圆形，表面有黑色霉层。随着果实的增大，病部因停止生长而变为凹陷、龟裂状。病果凸凹不平，成为畸形果。后期，病斑上面常有土红色粉红菌和浅粉红色镰刀菌腐生。后期新感染的病斑，因果面不再增大，所以病斑不凹陷，上面覆一层放射状黑色霉层。在贮藏期发病果实的病斑逐渐扩大。",
        author: "为害症状",
        source: "苹果黑星病"
    },
    {
        content:
            "苹果黑星病在世界各苹果产区均有分布；在中国主要分布于黑龙江、辽宁、吉林、河北、河南、山东、安徽、江苏、浙江、陕西、云南、四川、新疆和甘肃等省，其中在黑龙江、辽宁、吉林、河南、河北、山东发生较重。",
        author: "分布范围",
        source: "苹果黑星病"
    },
    {
        content:
            "病原主要以菌丝体在病枝和芽鳞内或以子囊壳在病叶中越冬。第2年春天，子囊孢子成熟，降雨后从子囊壳中弹射出来，随风雨传播，成为当年的初侵染源。病原侵染后在病斑表面产生分生孢子，成为再次侵染的主要来源。病原可被蚜虫传播。",
        author: "侵染循环",
        source: "苹果黑星病"
    },
    {
        content:
           "发病时期：中国辽宁省沈阳市从5月下旬开始发病，6月下旬至7月上旬为发病盛期，9月下旬发病停止。果实从膨大期开始发病，膨大后期发病最重，成熟期发病较少。陕西渭北6-7月份是发病盛期。" +
            "发病条件：各品种间感病性存在一定差异。降雨早、雨量大的年份发病重。特别是5-6月份花蕾开放和花瓣脱落期的降雨量，是决定病害流行的重要原因。树龄高，树势衰弱，管理粗放，抗病性差。密度过大，通风、透光条件不好，病菌极易传播蔓延。着露时间长的枝条易发病。",
        author: "流行规律",
        source: "苹果黑星病"
    },
    {
        content:
            "1.合理修剪：保证果园通透性良好，是减轻黑星病发生的关键：在冬季修剪后，亩枝量控制在8万条左右，以保证园内通透性良好；春季萌芽后及时抹除剪锯口附近的无用萌芽；夏季适时剪除多头枝，保持枝条单轴延伸，秋季疏除多余无用大枝，防止树冠郁闭，降低病害的发生。" +
            "2.维持健壮的树势，提高树体抗病力：通过增加肥水，控制结果量等措施，保证树体健壮生长，提高树体抵抗黑星病的能力。" +
            "3.认真搞好清园工作，减少病源：冬季认真清扫落叶，彻底清除园内杂草，春季刮除枝溃疡病斑，在芽露红期喷5波美度石硫合剂，降低田间病菌数量，减轻黑星病的发生。",
        author: "防治方法-农业防治",
        source: "苹果黑星病"
    },
    {
        content:
            "在5月初病菌侵染前及时喷施10%（质量分数，后同）多抗霉素可湿性粉剂1000-2000倍液或10%农抗120可湿性粉剂800倍液、40%杜邦福星乳油8000-10000倍液、喷克800倍液、龙灯福连800-1000倍液等高效保护性杀菌剂，阻止病菌侵染。" +
            "在病害症状出现后，及时喷施渗透性强，耐雨水冲刷，药效持久稳定的具有治疗和铲除作用的杀菌剂，以控制危害。生产中可选用1000-1200倍的龙灯福连液、丙环唑5000-6000倍液、菌毒清500-600倍液、戊唑醇1000-1500倍液、世高2000倍液、苯醚甲环唑1500倍液防治。",
        author: "防治方法-化学防治",
        source: "苹果黑星病"
    }];

const carouselSlidesData_heban = [
    {
        content:
           "病原在有性态为称苹果双壳菌，属子囊菌门真菌；无性世代苹果盘二孢菌，属半知菌类真菌。",
        author: "病原特性",
        source: "苹果褐斑病"
    },
    {
        content:
            "苹果褐斑病主要为害叶片，其次是果实和叶柄。" +
            "叶片症状：褐斑病在叶片上主要有针芒型、同心轮纹型和混合型3种。①针芒型。病斑呈针芒放射形向外扩展，斑点小且多，形状不固定，病斑上有很多隆起的小黑点，后期叶片渐黄，病部周围及背部仍保持绿色。②同心轮纹型。发病初期叶面出现黄褐色小点，逐渐扩大为圆形，中心黑褐色，周围黄色，病斑周围有绿色晕圈，直径1-2.5厘米，病斑中心出现轮纹状黑色小点，病斑背部中央深褐色，四周浅褐色，无明显边缘。③混合型。病斑暗褐色，较大。近圆形或数个不规则病斑连接在一起形成不规则形，直径0.3-3厘米，其上散生黑色小点，但轮纹状不明显，后期病叶变黄，病斑边缘仍保持绿色，时间长了病斑中间呈灰白色。上述3种症状一般难以区分，品种不同发病症状不同。3种症状共同特点：发病后期病斑中央变黄，周围仍保持绿色晕圈，且病叶容易脱落。" +
            "果实症状：果实染病初期果面有淡褐色小点，渐扩大呈圆形或不规则形，边缘清晰，褐色斑稍凹陷，直径4-6毫米，表面散生褐色小点，病斑表皮下果肉褐色，组织疏松不深，呈干腐海绵状。" +
            "叶柄症状：叶柄染病后，产生长圆形褐色病斑，常常导致叶片枯死脱落。",
        author: "为害症状",
        source: "苹果褐斑病"
    },
    {
        content:
            "病菌以菌丝团或分生孢子盘在落叶上越冬，第2年春季降雨后产生分生孢子，随雨水冲溅至树冠下部的叶片上，成为初侵染菌源，继而进行多次再侵染。一年内有多次再侵染，其周年流行动态可划分为4个时期。4-6月为病原菌的初侵染期，其中落花后至6月底是子囊孢子侵染期，也是预防褐斑病的第1个关键时期。7月是病原菌累计期，初侵染病斑于7月发病，并大量产孢，进行再次侵染，不断积累侵染菌源，防治病害的第2个关键时期。8月、9月是褐斑病的盛发期和大量落叶期，病原菌若在7月底累积至一定的数量，再遇连续阴雨，可导致病原菌的大量侵染，引起严重落叶。10月、11月随着气温下降，病叶不易脱落，病菌在病叶内不断生长扩大，为越冬作准备，10月底果园内的病叶数量直接决定了越冬病菌的数量。凡春季多雨、夏秋季多雨、高温潮湿的年份，病害就会流行。分生孢子借风雨传播，潜育期一般为6-12天，最长可达45天，发病至病叶脱落历时13-55天。气温高时，潜育期短，发病进程迅速，病叶脱落快。",
        author: "侵染循环",
        source: "苹果褐斑病"
    },
    {
        content:
           "适宜的气候条件是褐斑病发病较重的主因，不同年份褐斑病发生早晚和发生程度不同，其主要原因是当年雨水来得早晚和降雨次数多少、降雨量大小而定，降雨早、次数多、雨量大，褐斑病发生早且严重，降雨次数少且雨量小，褐斑病发生晚且轻。" +
            "1.施有机肥过少，氮多磷钾少，养分不平衡，负载量过大，树体衰弱，本身抗病能力差，病菌易侵入，易发生褐斑病。" +
            "2.药剂防治存在问题，喷药不适时，间隔时间长，雨前雨后用药不对路，喷药液量少等会造成褐斑病发生。" +
            "3.高温时期，环剥不适时，环剥量过重，导致环剥口不能正常愈合，树体养分输导受阻，营养供应不上，影响树体正常生长，抗病力减退，易引起褐斑病发生。" +
            "4.地势低洼，栽植密度大，枝条茂密，荫蔽严重，通风透光差，湿度高，给病菌侵染创造了有利条件，促进褐斑病的发生蔓延。",
        author: "流行规律",
        source: "苹果褐斑病"
    },
    {
        content:
           "1.采用综合防治措施，加强果树管理，彻底清园，消灭越冬病源，适时防治。选好对症药剂，掌握好喷药时间和喷药液量，提高防效。" +
            "2.加强栽培管理，增施有机肥，增施生物菌肥，配方全营养施肥，增强树势，增强果树抗病抗逆能力，减少褐斑病的发生。" +
            "3.及时合理修剪，改善通风透光条件，降低果园湿度，做好洼地排涝，恶化病害发生环境，减少褐斑病的发生；适时环剥，合理环剥，适期愈合，以免高温环剥过重愈合不良，导致果树抗病力减弱。" +
            "4.及时疏花疏果，减少负载量，增强树势，减少病害。" +
            "5.苹果落叶后，及时清理落叶，集中烧毁，同时浅耕果园，减少越冬病菌。" +
            "6.果实套袋，减少褐斑病的病果率，同时在套袋后喷1次防治苹果褐斑病的铜制剂农药，如波尔多液，未套袋果园不可用，以免产生药害。",
        author: "防治方法-农业防治",
        source: "苹果褐斑病"
    },
    {
        content:
            "药剂防治，药剂可选择戊唑醇、丙环唑、宁南霉素、多抗霉素、农抗120等，喷药时要兼顾叶片背面、树体内膛及树冠下部叶片，力求均匀周到。" +
            "1.发病前使用药剂预防。可选用70%丙森锌（安泰生）可湿性粉剂600-800倍液，80%大生M-45可湿性粉剂1000倍液，68.75%易保1200倍液，80%超威多菌灵可湿性粉剂1000倍液等。" +
            "2.发病初期与积累期，交替使用内吸性治疗剂控制。43%戊唑醇悬浮剂3000倍液 （注意：戊唑醇套袋后使用，一年内最多用2次，否则对果实着色不良），也可选用40%氟硅唑（福星）乳油8000倍液，40%腈菌唑（信生）可湿性粉剂 8000倍液，62.25%腈菌唑+代森锰锌（仙生）可湿性粉剂600倍液等。" +
            "3.盛发期处理，除以上内吸性治疗剂外，还可在8-9月对已套袋的果园喷布1-2次波尔多液或多宁或必备，保护叶片，波尔多液的配比为 1（硫酸铜）:1.5-2（生石灰）:160-200（水）。",
        author: "防治方法-化学防治",
        source: "苹果褐斑病"
    }];

const carouselSlidesData_bandianluoye = [
    {
        content:
            "病原为苹果链格孢的强毒株系，属半知菌亚门真菌。",
        author: "病原特性",
        source: "苹果斑点落叶病"
    },
    {
        content:
            "苹果斑点落叶病主要危害叶片，尤其是展叶20天内的幼嫩叶片；也危害叶柄、一年生枝条和果实。" +
            "叶片：新梢的嫩叶上产生褐色至深褐色圆形斑，直径2-3毫米。病斑周围常有紫色晕圈，边缘清晰。随着气温的上升，病斑可扩大到5-6毫米，呈深褐色，有时数个病斑融合，成为不规则形状。空气潮湿时，病斑背面产生黑绿色至暗黑色霉状物，为病菌的分生孢子梗和分生孢子。中后期病斑常被叶点霉真菌等腐生，变为灰白色，中间长出小黑点，为腐生菌的分生孢子器有些病斑脱落、穿孔。夏、秋季高温高湿，病菌繁殖量大，发病周期缩短，秋梢部位叶片病斑迅速增多，一片病叶上常有病斑10-20个，影响叶片正常生长，常造成叶片扭曲和皱缩，病部焦枯，易被风吹断，残缺不全。" +
            "枝干：在徒长枝或一年生枝条上产生病斑褐色或灰褐色，芽周变黑，凹陷坏死，直径2-6毫米，边缘裂开。发病轻时，仅皮孔稍隆起。" +
            "果实：果面的病斑有4种类型，即黑点锈斑型、疮痂型、斑点型和黑点褐变型。①黑点锈斑型：果面上的黑色至黑褐色小斑点，略具光泽，微隆起，小点周围及黑点脱落处呈锈斑状。②疮痂型：灰褐色疮痂状斑块，病健交界处有龟裂，病斑不剥离，仅限于病果表皮但有时皮下浅层果肉可成为干腐状木栓化。③斑点型：果点为中心形成褐色至黑褐色圆形或不规则形小斑点，套袋果摘袋后病斑周围有花青素沉积，呈红色斑点。④黑点褐变型：果点及周围变褐，周围花青素沉积明显，呈红晕状。",
        author: "为害症状",
        source: "苹果斑点落叶病"
    },
    {
        content:
            "苹果斑点落叶病在世界各苹果产区均有发生；主要分布于中国、美国、新西兰和津巴布韦等国，日本、朝鲜半岛发生较重",
        author: "分布范围",
        source: "苹果斑点落叶病"
    },
    {
        content:
            "苹果斑点落叶病以菌丝和分生孢子在病落叶上越冬。第2年苹果展叶期借雨露雾水萌发，随风雨或气流传播，侵染幼嫩叶片。病菌从侵入到发病需要24-72小时。生长期田间病叶不断产生分生孢子，借风雨传播蔓延，进行再侵染。",
        author: "侵染循环",
        source: "苹果斑点落叶病"
    },
    {
        content:
           "发病时期：一年有2个发病高峰期。第1高峰从5月上旬至6月中旬，孢子量迅速增加，致春秋梢和叶片大量发病，严重时造成落叶；第2高峰在9月份，这时会再次加重秋梢发病重度，造成大量落叶。" +
            "寄主抗性：不同品种的发病情况有明显差别，如富士、金冠等抗病。" +
            "发生条件：苹果展叶后，雨水多、降雨早，则田间发病早。在夏、秋季，空气湿度大、高温闷热时，也有利于病原产孢和发病。春天气温上升到15℃左右，天气潮湿时，产生分生孢子，随气流、风雨传播，在叶面有雨水和湿度大、叶面结露时，病菌在水膜中萌发，从皮孔侵入进行初侵染，温度为20-30℃、叶片有5小时水膜，病菌可完成侵入。在17℃时，侵入病菌经6-8小时的潜育期即可出现症状。果园密植，树冠郁闭，杂草丛生，树势较弱、地势低洼均易发病。 此外，树势衰弱、通风透光不良、地势低洼、地下水位高、枝细叶嫩及沿海地区等均容易发病。此外，叶龄与发病也有一定关系，一般感病品种叶龄在12-21天时最易感病。",
        author: "流行规律",
        source: "苹果斑点落叶病"
    },
    {
        content:
            "1.选用抗病品种：根据生产需要，尽可能种植抗病品种，如金冠、乔纳金、富士等；减少易感品种的种植面积，控制病害大发生。" +
            "2.加强栽培管理：结合冬剪，彻底剪除病枝。落叶后至发芽前彻底清除落叶，集中烧毁，消灭病菌越冬场所。合理修剪，及时剪除夏季徒长枝，使树冠通风透光，降低园内小气候环境湿度。地势低洼、水位高的果园要注意排水。科学施肥，增强树势，提高树体抗病能力。",
        author: "防治方法-农业防治",
        source: "苹果斑点落叶病"
    },
    {
        content:
            "树体保护是预防此病的积极措施。药剂防治是有效控制病害的主要措施。关键要抓住2个为害高峰：春梢期从落花后即开始喷药（严重地区花序呈铃铛球期喷第1次药），10-15天1次，需喷药2-3次；秋梢期根据降雨情况在雨季及时喷药保护，一般喷药2次左右即可控制该病为害，严重果园或元帅系品种可视情况加喷1次。" +
            "常用有效药剂有：30%戊唑多菌灵悬浮剂1000-1200倍液、10%多抗霉素可湿性粉剂1000-1500倍液、25%戊唑醇水乳剂2000-2500倍液、80%代森锰锌可湿性粉剂800-1000倍液、50%克菌丹可湿性粉剂600-800倍液、75%异菌多锰锌可湿性粉剂600-800倍液、45%异菌脲悬浮剂1000-1500倍液、10%苯醚甲环唑水分散粒剂1500-2000倍液、50%异菌脲可湿性粉剂1000-1200倍液等。尽量掌握在雨前喷药效果较好，但必须选用耐雨水冲刷药剂。",
        author: "防治方法-化学防治",
        source: "苹果斑点落叶病"
    }];

class CarouselLeftArrow extends Component {
    render() {
        return /*#__PURE__*/(
            React.createElement("a", {
                    href: "#",
                    className: "carousel__arrow carousel__arrow--left",
                    onClick: this.props.onClick
                }, /*#__PURE__*/

                React.createElement("span", {className: "fa fa-2x fa-angle-left"})));


    }
}


class CarouselRightArrow extends Component {
    render() {
        return /*#__PURE__*/(
            React.createElement("a", {
                    href: "#",
                    className: "carousel__arrow carousel__arrow--right",
                    onClick: this.props.onClick
                }, /*#__PURE__*/

                React.createElement("span", {className: "fa fa-2x fa-angle-right"})));


    }
}


class CarouselIndicator extends Component {
    render() {
        return /*#__PURE__*/(
            React.createElement("li", null, /*#__PURE__*/
                React.createElement("a", {
                    className:
                        this.props.index == this.props.activeIndex ?
                            "carousel__indicator carousel__indicator--active" :
                            "carousel__indicator",

                    onClick: this.props.onClick
                })));


    }
}


class CarouselSlide extends Component {
    render() {
        return /*#__PURE__*/(
            React.createElement("li", {
                    className:
                        this.props.index == this.props.activeIndex ?
                            "carousel__slide carousel__slide--active" :
                            "carousel__slide"
                }, /*#__PURE__*/


                React.createElement("p", {className: "carousel-slide__content"}, this.props.slide.content), /*#__PURE__*/

                React.createElement("p", null, /*#__PURE__*/
                    React.createElement("strong", {className: "carousel-slide__author"},
                        this.props.slide.author), ",",

                    " ", /*#__PURE__*/
                    React.createElement("small", {className: "carousel-slide__source"},
                        this.props.slide.source))));


    }
}


// Carousel wrapper component
class Carousel extends Component {
    constructor(props) {
        super(props);

        this.goToSlide = this.goToSlide.bind(this);
        this.goToPrevSlide = this.goToPrevSlide.bind(this);
        this.goToNextSlide = this.goToNextSlide.bind(this);

        this.state = {
            activeIndex: 0
        };

    }

    goToSlide(index) {
        this.setState({
            activeIndex: index
        });

    }

    goToPrevSlide(e) {
        e.preventDefault();

        let index = this.state.activeIndex;
        let {slides} = this.props;
        let slidesLength = slides.length;

        if (index < 1) {
            index = slidesLength;
        }

        --index;

        this.setState({
            activeIndex: index
        });

    }

    goToNextSlide(e) {
        e.preventDefault();

        let index = this.state.activeIndex;
        let {slides} = this.props;
        let slidesLength = slides.length - 1;

        if (index === slidesLength) {
            index = -1;
        }

        ++index;

        this.setState({
            activeIndex: index
        });

    }

    render() {
        return /*#__PURE__*/(
            React.createElement("div", {className: "carousel"}, /*#__PURE__*/
                React.createElement(CarouselLeftArrow, {onClick: e => this.goToPrevSlide(e)}), /*#__PURE__*/

                React.createElement("ul", {className: "carousel__slides"},
                    this.props.slides.map((slide, index) => /*#__PURE__*/
                        React.createElement(CarouselSlide, {
                            key: index,
                            index: index,
                            activeIndex: this.state.activeIndex,
                            slide: slide
                        }))), /*#__PURE__*/




                React.createElement(CarouselRightArrow, {onClick: e => this.goToNextSlide(e)}), /*#__PURE__*/

                React.createElement("ul", {className: "carousel__indicators"},
                    this.props.slides.map((slide, index) => /*#__PURE__*/
                        React.createElement(CarouselIndicator, {
                            key: index,
                            index: index,
                            activeIndex: this.state.activeIndex,
                            isActive: this.state.activeIndex == index,
                            onClick: e => this.goToSlide(index)
                        })))));


    }
}




render( /*#__PURE__*/React.createElement(Carousel, {slides: carouselSlidesData_heixing}), carouselContainer_heixing);

render( /*#__PURE__*/React.createElement(Carousel, {slides: carouselSlidesData_heban}), carouselContainer_heban);

render( /*#__PURE__*/React.createElement(Carousel, {slides: carouselSlidesData_bandianluoye}), carouselContainer_bandianluoye);


// Render Carousel component
render( /*#__PURE__*/React.createElement(Carousel, {slides: carouselSlidesData}), carouselContainer);


