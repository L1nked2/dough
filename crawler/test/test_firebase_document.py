import sys

from numpy.lib.function_base import place
sys.path.append("../")

from copy import deepcopy

from firebase_document import PlaceDocument, StationDocument

PLACE_DICT_SAMPLE = {'place_name': '바비레드 강남본점', 'place_uuid': '505e7ffc-dd02-5ade-bc1d-4704a86e2385', 'place_road_address': '서울특별시 강남구 봉은사로6길 39 바비레드', 'place_legacy_address': '서울 강남구 역삼동 618-18', 'place_category': '양식 > 이탈리아음식', 'place_cluster_a': None, 'place_cluster_b': None, 'place_operating_time': [{'type': '매일', 'startTime': '11:30', 'endTime': '22:00', 'description': '라스트오더 21:00', 'isDayOff': False}], 'place_kind': None, 'place_menu_info': [{'name': '바비 스테이크', 'price': '22,000원', 'change': False}, {'name': '바비 치킨 스테이크', 'price': '17,900원', 'change': False}, {'name': '레드 갈비 스튜', 'price': '17,900원', 'change': False}, {'name': '레드 크림 갈비 스튜', 'price': '19,900원', 'change': False}, {'name': '레드 토마토 갈비 스튜', 'price': '19,900원', 'change': False}, {'name': '레드 크림 파스타', 'price': '17,900원', 'change': False}, {'name': '레드 커리 파스타', 'price': '17,900원', 'change': False}, {'name': '레드 토마토 파스타', 'price': '17,900원', 'change': False}, {'name': '레드 소이 파스타', 'price': '15,900원', 'change': False}, {'name': '레드 갈릭 밥스타', 'price': '14,900원', 'change': False}, {'name': '스테이크 샐러드', 'price': '21,000원', 'change': False}, {'name': '리코타 치즈 샐러드', 'price': '14,000원', 'change': False}, {'name': '샐몬 샐러드', 'price': '15,000원', 'change': False}, {'name': '플레인 샐러드', 'price': '10,000원', 'change': False}, {'name': '치킨 브레스트 샐러드', 'price': '14,000원', 'change': False}, {'name': '바비 스테이크 포케', 'price': '14,900원', 'change': False}, {'name': '바비 갈비 포케', 'price': '12,900원', 'change': False}, {'name': '바비 샐몬 포케', 'price': '14,900원', 'change': False}, {'name': '바비 치킨 포케', 'price': '12,900원', 'change': False}, {'name': '바비 크림 파스타', 'price': '10,000원', 'change': False}, {'name': '바비 토마토 파스타', 'price': '10,000원', 'change': False}, {'name': '바비 볶음밥', 'price': '9,000원', 'change': False}], 'place_naver_link': 'https://pcmap.place.naver.com/restaurant/21607745', 'place_main_photo_list': [], 'place_provided_photo_list': ['https://ldb-phinf.pstatic.net/20191024_121/1571898688775cQY95_JPEG/hG1VeqcOLYXXlgd-5rKDiJSP.jpg', 'https://ldb-phinf.pstatic.net/20210308_289/1615192533547AmoSO_JPEG/PKaFW-tj2d8NNElKCJyRN1BE.jpg', 'https://ldb-phinf.pstatic.net/20191024_286/1571899011837k9tAA_JPEG/YOZ9CPDWZs0lke-YzizKW2YY.jpg', 'https://ldb-phinf.pstatic.net/20210308_192/1615167050468kebUP_PNG/5gIwweBOJcvE46x2A3AX6vmE.png', 'https://ldb-phinf.pstatic.net/20191024_45/1571899014890ooJgQ_JPEG/jmxTTJ5_KZRVlM1zset51gST.JPG.jpg', 'https://ldb-phinf.pstatic.net/20191024_259/1571898689526sYpct_JPEG/X9TY2U1o-5qQ-075ug0zcz2I.jpg', 'https://ldb-phinf.pstatic.net/20191024_7/1571898690030CfI1i_JPEG/_g---6CEOGw2iGGrlDQWVXLF.jpg', 'https://ldb-phinf.pstatic.net/20191024_165/1571899012166x2HyG_JPEG/9Jscs_arM5JwA8utAa1j0whA.JPG.jpg', 'https://ldb-phinf.pstatic.net/20201204_216/1607070065506ewSdq_PNG/5dH5RWbRjU9PAz0dHMy9TuRm.png', 'https://ldb-phinf.pstatic.net/20201106_240/16046524569805WRkn_JPEG/Ka4fZMNdqmGXHYygCK0f1MFL.jpg', 'https://ldb-phinf.pstatic.net/20181220_168/1545283653391DMtva_JPEG/HUCswEEWt1JfUG3mQn4rh6Tm.JPG.jpg', 'https://ldb-phinf.pstatic.net/20191024_7/1571898690030CfI1i_JPEG/_g---6CEOGw2iGGrlDQWVXLF.jpg', 'https://ldb-phinf.pstatic.net/20191024_26/1571898690623wyspR_JPEG/QgwnMiwB1ToBKv_nAMWFwMlq.jpg', 'https://ldb-phinf.pstatic.net/20191024_142/1571898802768BfYwJ_JPEG/6tNwUvj9l7h9tTnk497deNYW.jpg', 'https://ldb-phinf.pstatic.net/20181220_163/1545283652045lwU67_JPEG/T-ApJNrGhT70BZErsvaQcaym.JPG.jpg', 'https://ldb-phinf.pstatic.net/20181220_16/1545283651963vmiON_JPEG/ZrMLLQxZbmWLagbwjjaGg1az.JPG.jpg', 'https://ldb-phinf.pstatic.net/20191024_216/1571899010630ixWeX_JPEG/cI_7iB0O4gqxfJLfLWy24Kqr.JPG.jpg', 'https://ldb-phinf.pstatic.net/20191024_212/15718990097257TtnT_JPEG/epslYG2sJEcQxPUtLsY4E0ah.JPG.jpg', 'https://ldb-phinf.pstatic.net/20191024_227/1571899009575bGDzA_JPEG/ud1Ee70HmodApzvV7KSVn37k.JPG.jpg', 'https://ldb-phinf.pstatic.net/20191024_65/15718990153097RmIa_JPEG/gEP7fc7l1kW2nd-23BAYkdtD.JPG.jpg', 'https://ldb-phinf.pstatic.net/20201218_243/1608255346808smsNJ_PNG/ASnWt1Y2Z7_5noaOMBwCvZ4g.png', 'https://ldb-phinf.pstatic.net/20190129_249/15486897650693TbAP_JPEG/Ro4zVJtql-0m2ZbtC60F7YE4.jpeg.jpg', 'https://ldb-phinf.pstatic.net/20190129_34/1548689755565JElJI_JPEG/MiEDpkVeloXI04UkLRxgqFGV.jpeg.jpg', 'https://ldb-phinf.pstatic.net/20181220_286/15452836491992o1kx_JPEG/LeA4U2OQuVtE_wwCmOpiW_67.jpg', 'https://ldb-phinf.pstatic.net/20181220_248/1545283652626QEvsL_JPEG/LRbe9E3SRhTk7jyxvStvbeyC.jpg', 'https://ldb-phinf.pstatic.net/20181220_242/1545283651972bLGlW_JPEG/7NbBPdNrTIQw-urDkBmknxo1.JPG.jpg', 'https://ldb-phinf.pstatic.net/20181220_78/154528365274637M1S_JPEG/HAcvMC8kRo-Knrj5Wtuc7H1e.JPG.jpg', 'https://ldb-phinf.pstatic.net/20190411_139/1554958415462fVLdi_JPEG/CwHjiZQosEtSlFQp8sdl5vyk.jpg', 'https://ldb-phinf.pstatic.net/20200312_175/1584024435396GoUVl_JPEG/jv5oWPCOlEgIPmSe1LozQAA3.jpeg.jpg', 'https://ldb-phinf.pstatic.net/20201106_209/1604652456938VsmOL_JPEG/J5Fb8AkRQcHQe9zKE1mKbpkY.jpg'], 'place_inside_photo_list': ['https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2F20160815_76%2Fnhb2134_1471235984325AqNQi_JPEG%2FNaverBlog_20160815_133941_05.jpg', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMDA4MjhfNSAg%2FMDAxNTk4NjAwNjg4NzMw.LO77zj0lFe0Mq67nJLijeYXRkyZZKlQhH8huQFawbR4g.-9YUEuQRAak0iSRGnav_Qrl1bwfpvFtx2igQzUXcbDgg.JPEG.dino5730%2FDSC06662.jpg', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2F20140328_62%2F121snowdrop_1395970284479QjUhn_PNG%2F2014-03-28_102059.png', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2F20130521_61%2Ffuture8323_1369114901725Tn09N_JPEG%2FIMG_2724.JPG', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2FMjAxOTAzMzBfMjIx%2FMDAxNTUzODkwOTUwMTI5.JG3U201_AOr4-6wPxSnxUl5O4gMRxf3w51N3XSbo_7Qg.9HhcBOlttsqIWprGgIknn3bBQX3UvdWr23i_LXQNBZ4g.JPEG.dd945%2FIMG_5972.JPG', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2F20130716_16%2Fjehm0410_1373961461137QaFPs_JPEG%2F20130712_175019_%25BA%25B9%25BB%25E7.jpg', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMDExMTZfNzcg%2FMDAxNjA1NDg2MzkxNTgz.tSJwuvY6O1ncqVTInVEejjIpNvB42QgDZbY5M5W3iYMg.5WRsd1gk9iDWyGsBgHCjTlBkGAgY3dt4QvJbjmEXSK4g.JPEG.fkdlzj3751%2FKakaoTalk_20201116_092007072_06.jpg', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMDA0MDhfMTgz%2FMDAxNTg2MzIxMDQzNjU3.ZPOhYOpaWMOUidrkd_PbDRt7fKTv6afVyh-OFhfWHm0g.jUC0NxeY5DfBY1U-HefYazoOgjmfHGrx0uRJ3RhXg8gg.JPEG.qngreen%2FP20200408_115222982_1AA5734D-B8DB-4148-B026-2255275CB5E1.jpg', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2F20121024_54%2Fcooljayzeun_1351043541559yuyVW_JPEG%2FDSC_0486.JPG', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMTA5MThfMzEg%2FMDAxNjMxOTU4OTIyMjE2.B32dmeh-6qRjZO6xu7VpDwluCyxp6VHHsytPkJJxmtMg.g3XaKCH58V1q7aTpb4-gtT3BtEWrIkl6yzmumP-Itksg.JPEG.silver9811%2F20210823%25A3%25DF160430.jpg', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2F20160825_34%2Forigan75_1472125159783LIK4Y_JPEG%2FDSC05562.jpg', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMDA3MDhfNTcg%2FMDAxNTk0MjIwMTc1NTA0.y2r_RkyY0awPfzty9Hi0gv470qYAu0Hv86mlQwk4D0Ag.bX6HfZrYtB-gHAR3dlyytGLUr-0IRuh3ezojHIQPAHog.JPEG.starry_life%2FIMG_1684.JPG', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMTA3MjBfMjU4%2FMDAxNjI2NzkwMDU4NjU0.s6JFvkXj-5Q1uVG2XIC4_51qmJGfAiV6RqOZude2pVYg.yBSWHaqQC_yLU6zpE-kFrQsZDIMUiJXcfdZzvKzV_7wg.JPEG.lklk332%2FIMG_7285.jpg', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMTEwMDdfMTgw%2FMDAxNjMzNjE3NTA4NTI4.gBxhvb6H7Zcbk5fLdlNdppsDS7If99A1TGTjaao7ZJog.PFIvCTdKfQqfLqDEmlkTcCWP7zduzOAcoMwOg98it0wg.JPEG.bluesipar%2FIMG_0129.JPG', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2FMjAxNzA2MjlfMzYg%2FMDAxNDk4NzQzOTI3Mjg3.TWf6jnjX4Y_tKkJI87sYr5dKuMt__XdqsRvp9myaxWMg.zqxE9s-omCMs1m_I22-YKdOoy1WuiOio7pinFP8uxJIg.JPEG.yu_1400%2FP6290011.JPG', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2FMjAxOTAzMDdfMjk0%2FMDAxNTUxOTQwNDU2NTg5.5xwkMTAu65Dzf3Vy-DQS5Qt4szcRPoVcLIoNQDItZogg._4bXJBmMGMg0HKOes6aQuwJ4N2U9wExQzXbeSS1fUjUg.JPEG.anna04143%2F20190302_125259.jpg', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2F20160815_144%2Fnhb2134_1471235991352GACsc_JPEG%2FNaverBlog_20160815_133950_17.jpg', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMDEwMDZfNjgg%2FMDAxNjAxOTc4ODE2NjM3.-KgXlTw1BXYSjKQ_sw_o7bkmJlaUmt79ZqlbRCCrdAkg.kX8oIS-8gJuhdYyIx7j0pj06OejT5BlZKVJJW06LTeMg.JPEG.b_sinabro%2FIMG_3608.jpg', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2FMjAxOTA5MDdfNzgg%2FMDAxNTY3ODIzOTkzNzkw.EvjtfQ8UbHtbQ_RAM9QBODm5YcfpQ5Qng2PV-dHBnGIg.TeGqXltr_pgf-KHQi9TXdF_HWWXidX99neS1D5DVVW4g.JPEG.yunsanggul%2F20190905_173136.jpg', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2F20130426_7%2Fskystation11_1366932466223OsRVO_JPEG%2F2.jpg'], 'place_food_photo_list': ['https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2F20131122_208%2Fpure830423_1385089671339mwlxT_JPEG%2FIMG_3772.JPG', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2FMjAxNzA2MjJfODgg%2FMDAxNDk4MTExNjAyMzcw.IziBhBoW6IzW0tWvW66ECMFpiCq1YvtZhYUUaKKICxsg.R3vTZMGmMWpSaZJUTUF5tqt_m_2_2d05CRxCerhWgocg.JPEG.freetempo_me%2F20170525_121011.jpg', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2F20160802_270%2Fheroine_ms_1470107891309aEdpl_JPEG%2FattachImage_2166746460.jpeg', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2F20130609_210%2Fhyosunv_1370789316839IpJT6_JPEG%2FIMG_2578.JPG', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2FMjAxOTEyMDdfMTAx%2FMDAxNTc1NzA0Njg5NjUy.YA6iR3e0l9HFCAfMPQFDLKG1UbrNIhh3kriJkwmewz4g.WPwLjtIJ7TCzXLDpV-3O5iyQN8SkUxxm3A_RvLTckukg.JPEG.yunji0203%2FIMG_8537.JPG', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMDA5MDNfMjgz%2FMDAxNTk5MDYwNzI5NTcy.kO8Eev6z34kVLB1gMw2EeyB5JudEAc0RGMa4fUibdVwg.CxBeRjGP0TK9vBt5Vtd6-ulVXy84fk1gEZQvNimGnQIg.GIF.mj517215%2F3331359688.gif', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2F20141024_56%2Fmeroko7957_1414118834397cA0cx_JPEG%2FSAM_0133.JPG', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2FMjAxODA4MDNfMjgw%2FMDAxNTMzMzAwNjM3MzMz.IMIRZVFcJGOm3QpsbQ5Gn92c85Q3Q01x5FjeLam9nCMg.rfELACcPGC8Y1nAOzr6MUZ9k-GdQSUqjgysq15i04BAg.JPEG.bja601%2F%25B9%25D9%25BA%25F1%25B7%25B9%25B5%25E5_%25B0%25AD%25B3%25B2%25C1%25A1_%252842%2529.JPG', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2F20160322_295%2Flagae52_1458576257583WP6mr_JPEG%2FDSC01607.JPG', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMTA1MTdfMjYx%2FMDAxNjIxMjU2NTMyOTU3.elUnwgei6MSeXpT3aol3OGly-NGYzjkUTZp_VKU_FiIg.aPMRb4Ju_IrQKTLjynL2QgBxKEGzW0s2lYcBIFUHLG8g.JPEG.ssun2415%2FIMG_8579.jpg', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2FMjAxODA0MTRfMzUg%2FMDAxNTIzNjc0NDE4Nzg4.CDRTicX3TQApX59kZAnQbCmh1JGvj946k0-oUQwg-i0g.XDOEfGlwvUWr9MIkIWNAWuU43k7bThJW78Ko8Ej304kg.JPEG.cs_nohsung%2FKakaoTalk_20180414_094713033.jpg', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2FMjAxOTEwMTFfMzAw%2FMDAxNTcwNzI0MzI5ODM4.2mWT-hlubm1tx94UbynBu3UxyjeUPmcB9H90hl53zEcg.jm62xG9Bw6dOM35-qu7jOzjhCu-GtYQbBihzg0ZDye4g.PNG.seraphhr%2F%25B0%25AD%25B3%25B2%25BF%25AA%25B8%25C0%25C1%25FD%25B9%25D9%25BA%25F1%25B7%25B9%25B5%25E5%25B8%25C5%25BF%25EE%25B8%25C0_%252882%2529.png', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2FMjAxODA2MTJfNTIg%2FMDAxNTI4Nzk1MjgxNjQx.3U3yqKYArY1CQyc1j_e8ghX9gpmxZILAGDLhOyI69zgg.jk7RaonsCuzQvnKGQErDRB-vgVJSSb-a5Nnwb8jYcZMg.JPEG.j-u-n-g%2FKakaoTalk_20180611_094412781.jpg', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMTAzMTBfMTI3%2FMDAxNjE1MzYyODkyNTM2.BQO5XofMNRvWUquvPusLWSN78YgGvcWT1oZPb42acR0g.Qgf4iCxRJr5GbczHUIE2einsk9OPB_uU2qiAMH69Lh4g.JPEG.nest_2000%2F20210309_193457.jpg', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMTA3MjFfMjk2%2FMDAxNjI2ODIyMzIxNjg0.SBA3BkQQhglBHZ48h7EQzBRJgOLNUyoX6AyMGLvEXewg.XARvOtkpAzJ-sCp0LSmCkCW4r7iWZGFBIzFC4rT-EDQg.JPEG.leesuna811%2FIMG_1818.jpg', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2F20130223_22%2Fcreamball27_1361629746930ItUFG_JPEG%2FP20130221_202808194_6BDA3139-410C-4307-910E-0448993331C1.JPG', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2FMjAxOTA3MDlfMTI2%2FMDAxNTYyNjEzNjk5MjIx.Aq0XjA8IOnvDcn0wONmTYoIaouYwFvFaNsZhH3IqOSkg.TRx3W1ol2g0T2sRK76fOZQmHyTXgId-6_uFWvy9PP-kg.JPEG.casa0216%2F2019-07-08-19-07-22.jpg', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2FMjAxNjExMDZfMjE2%2FMDAxNDc4NDI0NzQ4NjQ2.NP5PaUx4XgL2lhIFOCXLToyLfzyZfjiIRSRxNpq0c5Ig.6_skV-EsfyyPQw7cygCCOGGS08F4oCW1CjJPmBHrVFog.JPEG.qodudal92%2FKakaoTalk_20161106_182439943.jpg', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMTA4MTFfMjI0%2FMDAxNjI4NjY5MDIyNTE3.voWLVgtNo-Zvwe_0go_-dFyBBIwyQSCvm8RjxNU-pvYg.3P_kbHocxe75XdlZcDlezR5s5Wfj4X5ia8_r45HMN2cg.JPEG.dmsalstj%2F20210810%25A3%25DF183401.jpg', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2FMjAxOTEwMThfOCAg%2FMDAxNTcxMzc5Mzk4OTc4.23In6KI0VgaXm-K_st0FiKrTKUK3wQc8vCUupkZsMRsg.2yA-c6T1O9R04UkRlrjJy3aD4-2R28h9nWGuVThGVs4g.JPEG.jesus10203%2FIMG_1386.JPG'], 'place_menu_photo_list': ['https://ldb-phinf.pstatic.net/20211103_64/1635900289342iVAto_PNG/s-aBcObbgP6Od_clxx4ZVWU-.png', 'https://ldb-phinf.pstatic.net/20211103_186/1635900295336P4byF_PNG/1OSU2nUjegxvq7XhU7zvM1ZD.png', 'https://ldb-phinf.pstatic.net/20211103_80/1635900300760wyWOj_PNG/Ph1ZNBdEJ662q08H31eomrr6.png', 'https://ldb-phinf.pstatic.net/20211103_30/1635900306060G7O9U_PNG/K-LKGZ7v4EFUmPsY3B4Jb46A.png', 'https://ldb-phinf.pstatic.net/20211102_74/1635836491420pjS21_PNG/naW1nYmFGRUULI4FVMAA7kxX.png', 'https://ldb-phinf.pstatic.net/20211102_254/1635836497846EuNEg_PNG/0sQY8xxzw1BU7cyhaxibFtLr.png', 'https://ldb-phinf.pstatic.net/20211102_83/1635836502980jAQav_PNG/piiUZBM0bwveZfP2yvs1djp5.png', 'https://ldb-phinf.pstatic.net/20211102_2/1635836508002f9azT_PNG/A-TldwF-5RR5rQYYkXisVDtj.png', 'http://blogfiles.naver.net/20160327_242/rkdls7710_1459080654676YTdDy_JPEG/NaverBlog_20160327_211054_05.jpg', 'http://blogfiles.naver.net/20160327_175/rkdls7710_14590806578527Gkwl_JPEG/NaverBlog_20160327_211057_06.jpg', 'http://blogfiles.naver.net/20160327_142/rkdls7710_1459080660370r1iPc_JPEG/NaverBlog_20160327_211100_07.jpg'], 'place_telephone': '02-3452-1515', 'place_last_timestamp': '2022-01-01', 'parent_station_list': ['강남역'], 'place_coor_x': 127.02787873368902, 'place_coor_y': 37.502662523794655, 'place_views': 0, 'place_likes': 0, 'place_recent_views': 0}

def test_place_document_constructor_destructor():

    place_dict = deepcopy(PLACE_DICT_SAMPLE)
    place_docu = PlaceDocument(place_dict)
    place_dict2 = place_docu.into_dict()

    assert place_dict == place_dict2

def test_station_document_constructor_destructor():
    station_raw_dict = {'index': '0', 'rank': '1', 'id': '13479290', 'name': '강남역 2호선', 'tel': '02-6110-2221', 'isCallLink': False, 'virtualTel': '', 'ppc': '1', 'category': ['교통,운수', '지하철,전철'], 'categoryPath': [['226187', '226188', '226193', '226215', '226297'], ['226187', '226188', '226193']], 'address': '서울특별시 강남구 역삼동 858', 'roadAddress': '서울특별시 강남구 강남대로 396', 'abbrAddress': '역삼동 858', 'shortAddress': ['서울 강남구', '강남대로 396'], 'display': '<b>강남역</b> 2호선', 'telDisplay': '02-6110-2221', 'context': [], 'reviewCount': 0, 'ktCallMd': '4116e1a3f9de7b3c9439512dff25f497', 'coupon': '0', 'thumUrl': None, 'type': 's', 'isSite': '1', 'posExact': '1', 'x': '127.0276188', 'y': '37.4979517', 'itemLevel': '12', 'isAdultBusiness': False, 'streetPanorama': {'id': 'Vh7GcQCR285K+lyuTuFhhA==', 'pan': '-106.76', 'tilt': '10.00', 'lng': '127.0277388', 'lat': '37.4979878', 'fov': '120'}, 'skyPanorama': {'id': '9otQD2r9wCgsP7wLZvqJYw==', 'pan': '-4.18', 'tilt': '-30.00', 'lng': '127.0278549', 'lat': '37.4947205', 'fov': '124'}, 'insidePanorama': None, 'interiorPanorama': None, 'indoorPanorama': None, 'theme': {'isWingbus': '0', 'isWingspoon': '0', 'isHospital': '0', 'isMovie': '0', 'isSubway': '1', 'isStation': '0', 'isTerminal': '0', 'isAirport': '0', 'isLand': '0', 'isHotel': '0', 'themeId': '222', 'targetUrl': 'http://traffic.map.naver.com/Subway/StationInfo_Detail.asp?CID=1000&TMenu=2&LMenu=1&LID=2&SID=222'}, 'poiInfo': {'relation': {'poiShapeType': '1', 'shapeKey': {'typeName': 'RELA', 'wsid': '1.0', 'shapeID': '13479290'}, 'boundary': {'minX': '117.9926027', 'minY': '19.6944771', 'maxX': '117.9926027', 'maxY': '19.6944771'}, 'detail': [{'type': '9', 'sid': '1669336598', 'fullName': '강남역1번출구', 'name': '강남역1번출구', 'category': '지하철1번출구', 'xPos': '127.0287449', 'yPos': '37.4981051'}, {'type': '9', 'sid': '1605357428', 'fullName': '강남역2번출구', 'name': '강남역2번출구', 'category': '지하철2번출구', 'xPos': '127.0281542', 'yPos': '37.4973040'}, {'type': '9', 'sid': '1398268169', 'fullName': '강남역3번출구', 'name': '강남역3번출구', 'category': '지하철3번출구', 'xPos': '127.0284518', 'yPos': '37.4967732'}, {'type': '9', 'sid': '1823873927', 'fullName': '강남역4번출구', 'name': '강남역4번출구', 'category': '지하철4번출구', 'xPos': '127.0290834', 'yPos': '37.4954662'}, {'type': '9', 'sid': '1677575221', 'fullName': '강남역5번출구', 'name': '강남역5번출구', 'category': '지하철5번출구', 'xPos': '127.0286296', 'yPos': '37.4953331'}, {'type': '9', 'sid': '1511945340', 'fullName': '강남역6번출구', 'name': '강남역6번출구', 'category': '지하철6번출구', 'xPos': '127.0280671', 'yPos': '37.4965227'}, {'type': '9', 'sid': '1900424147', 'fullName': '강남역7번출구', 'name': '강남역7번출구', 'category': '지하철7번출구', 'xPos': '127.0277566', 'yPos': '37.4971848'}, {'type': '9', 'sid': '1690162690', 'fullName': '강남역8번출구', 'name': '강남역8번출구', 'category': '지하철8번출구', 'xPos': '127.0271863', 'yPos': '37.4975341'}, {'type': '9', 'sid': '1644300236', 'fullName': '강남역9번출구', 'name': '강남역9번출구', 'category': '지하철9번출구', 'xPos': '127.0268638', 'yPos': '37.4979524'}, {'type': '9', 'sid': '1372825586', 'fullName': '강남역10번출구', 'name': '강남역10번출구', 'category': '지하철10번출구', 'xPos': '127.0270280', 'yPos': '37.4986655'}, {'type': '9', 'sid': '1484766425', 'fullName': '강남역11번출구', 'name': '강남역11번출구', 'category': '지하철11번출구', 'xPos': '127.0274714', 'yPos': '37.4987772'}, {'type': '9', 'sid': '1565143980', 'fullName': '강남역12번출구', 'name': '강남역12번출구', 'category': '지하철12번출구', 'xPos': '127.0285867', 'yPos': '37.4984521'}]}, 'hasRelation': True, 'road': {'poiShapeType': '1', 'shapeKey': None, 'boundary': None, 'detail': None}, 'hasRoad': False, 'land': None, 'hasLand': False, 'polygon': None, 'hasPolygon': False}, 'homePage': '', 'description': '', 'entranceCoords': {'car': None, 'walk': None}, 'isPollingPlace': False, 'bizhourInfo': None, 'menuInfo': None, 'petrolInfo': None, 'couponUrl': None, 'couponUrlMobile': None, 'hasCardBenefit': False, 'menuExist': '0', 'hasNaverBooking': False, 'naverBookingUrl': '', 'naverEasyOrderUrl': None, 'hasNaverSmartOrder': False, 'reservationLabel': {'standard': False, 'preOrder': False, 'table': False, 'takeout': False}, 'reservation': {'benefit': ''}, 'hasBroadcastInfo': False, 'broadcastInfo': None, 'shopWindowInfo': None, 'hasNPay': False, 'carWash': '', 'parkingPrice': None, 'card': None, 'distance': '4629.22', 'marker': 'nres://marker/00070-00138', 'markerSelected': 'nres://marker/00070-00293', 'microReview': [], 'michelinGuide': None, 'indoor': None, 'markerLabel': None, 'subway': {'id': '222', 'lane': '2'}, 'evChargerInfo': {'summary': {'fastEvCharger': {'type': '급속', 'typeCode': '1', 'status': '', 'statusCode': '-1', 'names': [], 'nameCodes': []}, 'standardEvCharger': {'type': '완속', 'typeCode': '2', 'status': '', 'statusCode': '-1', 'names': [], 'nameCodes': []}}, 'evChargerList': []}}
    
    station_docu = StationDocument(station_raw_dict)
    station_dict = station_docu.into_dict()

    station_dict_ref = dict(
        station_name = '강남역 2호선',
        station_coor_x= '127.0276188',
        station_coor_y= '37.4979517',
        station_views= 0,
        place_list= list(),
    )

    assert station_dict == station_dict_ref

def test_place_document_convert_fill_in_cateogry():
    place_dict = deepcopy(PLACE_DICT_SAMPLE)
    place_docu = PlaceDocument(place_dict)
    place_docu._fill_in_category("../cat_to_tag_table")

    assert place_docu._kind[0] == '파스타/양식' and place_docu._kind[1] == '이탈리아'  
    assert place_docu._cluster_b == 0
    assert place_docu._category == '음식점'
  