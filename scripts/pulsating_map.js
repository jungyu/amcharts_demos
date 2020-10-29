am4core.ready(function() {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create map instance
    var chart = am4core.create("chartdiv", am4maps.MapChart);


    // Set map definition
    chart.geodata = am4geodata_worldHigh;

    // Set projection 投影
    chart.projection = new am4maps.projections.Miller();

    // Create map polygon series 多邊形
    var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

    // Exclude Antartica 排除南極
    polygonSeries.exclude = ["AQ"];

    // Make map load polygon (like country names) data from GeoJSON 生成地圖並載入多邊形
    polygonSeries.useGeodata = true;


    let gradient = new am4core.LinearGradient();
    gradient.addColor(am4core.color("#379BED"));
    gradient.addColor(am4core.color("#27B5D6"));

    // Configure series
    var polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";
    //https://www.amcharts.com/docs/v4/reference/polygon/
    polygonTemplate.polygon.fill = gradient;
    polygonTemplate.polygon.fillOpacity = 0.6;


    // Create hover state and set alternative fill color 懸停狀態時各國(多邊形)的填色
    var hs = polygonTemplate.states.create("hover");
    hs.properties.fill = chart.colors.getIndex(0);

    // Add image series
    //https://www.amcharts.com/docs/v4/tutorials/using-actual-images-in-mapimageseries/
    var imageSeries = chart.series.push(new am4maps.MapImageSeries());
    imageSeries.mapImages.template.propertyFields.longitude = "longitude";
    imageSeries.mapImages.template.propertyFields.latitude = "latitude";
    // https://www.amcharts.com/docs/v4/concepts/tooltips/
    imageSeries.mapImages.template.tooltipHTML = "{title}"; //tooltipText
    imageSeries.mapImages.template.propertyFields.url = "url";

    var circle = imageSeries.mapImages.template.createChild(am4core.Circle);
    circle.radius = 3; //半徑
    circle.propertyFields.fill = "color";

    var circle2 = imageSeries.mapImages.template.createChild(am4core.Circle);
    circle2.radius = 3;
    circle2.propertyFields.fill = "color";


    circle2.events.on("inited", function(event) {
        animateBullet(event.target);
    })


    function animateBullet(circle) {
        var animation = circle.animate([{ property: "scale", from: 1, to: 3 }, { property: "opacity", from: 1, to: 0 }], 3000, am4core.ease.circleOut);
        animation.events.on("animationended", function(event) {
            animateBullet(event.target.object);
        })
    }

    var colorSet = new am4core.ColorSet();
    colorSet.minColors = 15;

    imageSeries.data = [{
        "title": "Brussels",
        "latitude": 50.8371,
        "longitude": 4.3676,
        "color": colorSet.next()
    }, {
        "title": "Copenhagen",
        "latitude": 55.6763,
        "longitude": 12.5681,
        "color": colorSet.next()
    }, {
        "title": "<img width=\"300px\" height=\"200px\" src=\"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUTExMVFhUXFxgXFxUWGBUYGBUXFRUWFxcVFxUYHSggGBolHRUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGzImICUtLS0tLS0tLS8tLS0tLS0tLS0tLS0tLS0tLS8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIALcBEwMBIgACEQEDEQH/xAAbAAACAgMBAAAAAAAAAAAAAAADBAIFAAEGB//EAEAQAAEDAgMFBgQDBwMEAwEAAAEAAhEDIQQSMQVBUWFxBhMiMoGRFEKhsVLB0QcVI2KS4fAzgvEWQ1NyY6OyJP/EABoBAAMBAQEBAAAAAAAAAAAAAAECAwAEBQb/xAAzEQACAQIFAgMGBgIDAAAAAAAAAQIDERITITFBBFEUYaEiMnGBkfA0QlKxweEF0SMksv/aAAwDAQACEQMRAD8A7nMEN9MblthRW01TYTcWqsJ5pfIZkWKszQChkA3po1BXTuJCrU4phj51ui92CpZIWunwZRa5Nspt4LH4dp3LBTlHDDpoEPmHfgo8Vs8bki6hC6k0GnVArYVh0C6qde2jOSpQvqjmu7WjTV/UwbeCUfhOS6I1kznlQkipNNaNNWBwxG5HbSEXCd1UhFSbKU0lE0laOoLVTDgc02aDKZVGkoGmrOpRCE5kJlVFdMrzTUmUk0QoiRomxC4QRpQoGmmplbFNDFYbCJ92hupKy7pZ8NyWzDZdyodTQXU1dvwDjoEs7Au4fZMqkXyB05IqTSUXUVYvwpCEaaOLsCxWPahkKwqUUB1FMpAsKQshHdTWd2jiBhFyFkI2RbbTRxAwi+VYjFq2tiBhPUjiRxaouxXNqr3KK8BU0e3mssHYw8vRQ+IaTJBlKNCOx3JMqaQMxsbp1RwCaYeSRp1eSMzEgbilcB1UQeY01Q3OcNVr4sHcVneg8VrWDdMHBKmwkahHZfejMpg7wg6lgqmapUARohuwOsJukMttUZjgo5jWxTAnuUTqBGqE+kujfh2uSlTZ4VI9R3JugUD6ZQX0TxXQ/AJfEbP5KkeqQkumZztRhGqWwkvpscTctaT1IE6c0XtUwsptAcGlzolxDRABJBJI1sIlLdnATnZma4CC0Nc1waLyLEkbtSpP/IxXUql5eu5Zf4//AKzqX1vt5bfz6DHcLDh1ZfDLDRXdnnBkFaMOURlAncn20Cm6FMAIS6iwY9OJ4ai1ouJ9EYsGgCfbSG9S7sLnda7OhUbIpn4UnRSo4cDUAq2eGjRKvog3lMqt0K6VmV2JwDTySLsCAVfPa2Es4NlUhVdicqSKLEYccAkH0Lrp62FBFok/5qlXbOG8q8ayJSos559AcFHuOSvMRhgEuGAJs3QTKKsUI3KD2KxqxKXqMRVRmlTEe66LEz3CxNjJZZ21Wkhih1VkQFEAGYXlRmz1ZQTE2YVGZhSnKPoUw23y/VF1GgKkmJNwxRG0TyTGJqZYtM7gsoG/iEct6R1CipoWOG5KYw5iYsnqzGgT9ChNxUateOg/4U3VY6piwZOqKygjUa1M8RyLT+UonxFPTMPWR9wldQbCRbRPVbFAqFTadJhgknpB/NGpbSpuEgn2KW7GNDCu3EhG7gxqVNldp+Yf5yWq+IAGoSNmN0mcfyWeEoBedRCh3hG5YJSdusDTOGNVw8VNzS0g6ZnNabTcQUj2HwLHsqVS05g805NjDQ0m0kax7InbrFzg3jQlzBz84NvZI9iMQRTqgGwqmBpYtboDoLWC5cF+qXw/hnYpW6R/H/R11TBtWVMC2JASeHrGTJTIrHReg1JHnppghgwpDBhFc+yAa5CKbZrJE+4bxKwYUHepUqoOoRm1fZB3CrCtTAO6oLsG7grd1aAsp1QlU5I2FFEcE7ghuwjx8q6APuQpTyTZsgZcTl30XD5UrWY/guwkFCfSbyTxrtcCuimcNUovOoKXfRPBeg/BsdeECrs1nBVXV+RJ9N5nnj6Z4IXdngu6q7JG4BJ1dmAbgn8WuwvhWcjkPBYumODC0t4pdgeG8ywZVPBFZfcg06LuibwNQsPEKTkktEUjFvdmMbG5NUzP+FGqV2xMT6BRpYo7mD2hRlUutisYW5NtpTc34HSEyBPX7oRxHFi2MU0biPZSepUliQ46fb80F1RwFwJH1RhjGc0RlVrv7pWmFMp6mJqGYHsLIDC+Dmuei6J9O1gEMYUncAtdrg10UBw5/l52KPToFpkERwIVx8Aln7P4m3E2WxdzXXBGmeMewKmaQP8AkKLcLl8rx0lFYX/jb90HFdzYiVPCRcFG+EnW6h4j8wndp9lIZ40HoiogbZyf7S6eTB+EG9RoN4EQ7XlMesJf9nNMuGJBGlQeYyZIPmsPFa/pwU/2ntJwzJbMVJ10hpH1zRymbRIB+zlkuxADcpBbI6F9jxInXnG6BxS/Er74O+P4R/fJ2oZGrWn0WeD8A9kVrd0lbyLvPOAPazghGmw7vumQ0FRfRGqKMLnDjgt9zCO0CNVB9T1RuwAnGNy0Ho7DxWOAWuEi2CpOasgITq4G9Yxp1lAhSOIbuul6uLCKRrhRI0UnVyUs7GtEfmsOMaNSFsL7GxIP3sapLGVZ0RK2MZySdfFt3QsovsByXcQe8ysUziWrFWz7E7ruNYLbFN1sjm8ySrPDhj9He8BUmGxxyz3Dd2h15gqdHaAm8t6AkJXd7DbbnRDDiLH7FGDDwHW4VP8AGU7HO6/Uj1KaweMD/K+eXBTafI6fYspO+EGtRzLH1yBoZ5ghDbjW7zCTQOoJ2AvqomhGrh7qdTEUt5n0KVftfDM1/wDy79E6bBYMKobo8j3WziwB53E8sxSp7Q4bdP8AQUF3aKjo1j3HoB+aNma6LGnVeeI6lS7nMZdBPMSq9m1ah8uHd6uCYZiqv/hA/wB4/RI7LcZX4HmYNn4W+wWn4EboChTr1N9I+jmlE+NI/wC2f6mpbxNaQN+FI5+t0TDkt1lLv2mN7XfT9UpV2jw+qaMMWwJStuUf7T8RT7ukHiZz5TOUAzTEE8SCY5x1QP2c1WNqVwwz6g5RI8JI36mCJgjdAC3bjFBzAHVC2AfCLSC+n4zYzljTmo9jntFSoM5JLnzLjldBZJg6EQBz91wyi/EpX+9D0IteEZ6DV2g1uspR+2W7pQqQB1PpKZ+FadwXppRW55bxPYg3EvMwyNNYH1Kk81IMtmeBU/hxrH6dVsB25LfsMl3EM1QCMqXq16g4j0Vq7PuKRrgnX7KkZeQko+Yk/GPO9AdiKmuYpt1NBe0KylHsRcX3Fjj6g+Ypd2Ld+IpmrTCWewcFWLj2JtS7g/jHfiKH3o3l3utuprO45ql4iWkSBYfxe6nDTx90NtFGbSAStoZJmxSnitijyTFNqKFFzKqApkPBYnhCxSxj4Sho7UygBp06EeyadtzQRBvJj8lzWI7M41gzdyT/AOrmuI9AZ9lX1KGJYJfRrBpMS4PbfhJGquoUZbST+ZLNqrdHWO2o10gVA0k3aQWg85Fj7qdLEOHiykx8zZAtxKpsJVxwaBSw72iPMKMl0by4tknmrXBYrH02F9w/MLOpi4gzrc6C0Kc2o6K31/orC8t7/Q6DDbVxGUEMc5vCCT/Usxe0S4f6VRvEx+oTmxdruqNaH0quaILi1rRO+AXTHorCvSB3NA4khebKqlLWJ2Ri7bnMOoPIkOcBzcB+aUbg5N3E+tldV3YRph+IZ0Dgftol37QwDD/qyf5WuP1hWjVlxH0FcY8sG3AsbqWn1lNUsLRPzCeiXqbZwQ/7h/od+iHV7Q4RvlOY+o9NEyc3+VitQ7l3hmNp75amxWp6kR6LjXdqaYM/D/8A2H7ItLtSX+WnTA5yfqmfTylq1+wmclydZ39KYv7Fbq1BHhYfaPuqDD7d8UZXdWCQPzTtbGuOhKV9OHO7g8VhazjYAJM4arvc0dVKpWcdSfcoS6IUmuSM6yb2KXtJTqSA17XNPdjSC8mr5ZjygX58Vrs1ULajpylmZx7vQgOaC106319Un2iqMzvzMqnKG5qjQYaGw+BBuTMX48rw2FUaHj+HUJLgc8eBjixrSwXgNvulePL8Rf4/+j2IXfSv4fwdu3HD8DUWni/8v+qrmBGaxe04xPEUpFtTxDToTKaaXcVS06XNFbUePmKi4rgspPktsx3qLgq0Yx41KKzHlK4tDKSDVG/ypV9HkmWY4FTFZpS6obRla7DjghPwoKuoaoOpNRzGbAmUY2eEUbMEK07sKFVwCObJ8gy4orqWCC07Bxu9UZ9aNEvW2kALpk5sDUUa7sBBqPAQK22BFhdV9THuJ0CrGnN7kpVIosO9W0mMaPwlaRwvsLiQnT2xjjZtVo3WY0n6yl8SMXU/1MQ88s0D+kGPorc7Few2u3gCUtX2TVveAOJMx0U0op6JfQo7ta3+pXHZVdwkvJPU6dSUTDdn6sh3eZTuIkH3Vhg8EQWkkubvEH811GG7otAINuSEpyW37DRhF7/uc3gez1bOT3juZzEE9VY1tg1qhjM4N08xIj1V3UxwnK0AjjwUKj4gF2u5RvJ6srotEUVXsQAJkzxVHitlGkSJld5SpnzNdI3WN/Qqv2hhzUPjLY4fMjGrJPe4MCa2sebY3EgWDVWuxK7/ABnZJjrhwG+HEfRc9tDsq9ugBHIg/ZdtOvT2OSpQqbnPvxpO8pnA7bNEy0SeaOez1Tgg/uCsflPsV0KrTfJDKqLguNk9sQD/ABWzwcN3UTddG3tbhSJz+kGVwVfs9VaJc2Otj7JE4QhK40p6phvUjuj0ZvabDOuagHKD+UpmjtSg4S2q3+r8ivLjSKlRYC5rSXDM4N8IBMuMCxI380s4whFyb2DBylJRS3O02s97u8yvYQcwbTtOXKR3hMG4gEfqYQNlVajG0pewCQAw5ZcGuILjwdAgRvPVItwJBzBz98wKQs5wdY95bUgdCt4jZpeSc7zc5S4USRBk/OBIAPQOXx8uoTle6Pro0koYWelfAnWJCLTpRuXn+DdVDiW16rSCJkwJIm0OIi66rZu2KrY7zENcN+YCT6gr3lVxxUou6Z4OS4ycWrFvMHRYRaf0UsPt2jUIDS0nhP2TGIqsJuz8vyS5j5QcAoKg4BTzt5Ijo+VjfVyqNpYt9IGe6B5kW94TJ3BaxZZ2QZA6KOGLKgloIjr+a57DbRBIJqhz9wD2Mb6nMjv2lUJzCvhxFsuYOPrxTNNATR0AoN5qVgq6ntgZYNRhdya9wPSAsobSJmTPIUqghScmUUR0vnRL4iQod/JgPMn/AONw+6KMGXa1HdA0D7o4jYSuqpWph5V7Uw7GDxO/qISr8Vh2/MD0VIyk/dRNqK3KgYDhdEZsfNuhWrdrUBZuqFU2u2dyopVSbVMX/cJ4hYjHbTefusQ/5TXpF8KbY0Vc/ZEuzd476R7BYMUVnxJSqLRsaCYvCNy2mRuG/qqao6sHD+Fm3CCQArX4gqQxXJazQcSEsK2pof4fGBb33LVDDPc4w4O4undwvvTrq06ILXZdBCFhlMZbSLLndxVfj8S0XLmg9Zv0WquKZmlz2zrDnD6gquxzqNUE56c8QQY9itGlqaVXQRrbQZJvmje4kBVOI7QPB8LWR6u+5Q6+ApzZ4ceF/wBFlLZ1E+epHIAmPVdahFcHNKcnyKO25VJmQI4Bv6IlTbNZ485jlb7Jx2z8IImq7+k/kiGrhKYyiXcSNCmtHsLil3Kk4x5uST1UBiCTGUEqwrbTpEQGDpcfVQo4ymBZsE8L/WFrJcGxN8gsPQLzHdgfSFuvQpU5qGDlB8pBMmGjhvcE85pc2GtIDhcug+x4JfE4I0gIA8Trng1gLiQBreLBcnW1VCjLz0+/kdfR0pVK0V5lU/E4djT/AA6xl+UhrQS0023mHW84PI8NFCliMOW3p1mjO0NztDZ7yRlac3EDnpddT2NpU8s12x5iBLby6M8mJsxpHJwT3bemx2Gd3MOeCPDInmQdBABvzXjwoxdFzu7/AB00dj151pRr5fHrqF7NbPpYjDglrwWksIJgiIIkAkaEaJz/AKNpEyHO6E26Kr7D4nKalPNAIDxNrnUTH8wjouoNN3yvI9cy7OjrN0lZ7affyOLraKjWenmKYbYVSg7NRyg8/Eo7U2pWpecB9vlG/qBZNYjCveCCTfn/AHSNXYlY2bUdG8GCPYrpum7yOazStE5HG7YxNV1sw5NLlqhsqrU87g2fxfquy2ZsKowkuP0bdMVHlhhzCeEDRVzktIomqTesmUdLsnlbq0njln80zhtk1WW70NH8rGx9VetZI4KL6bRqbqeY3uUwJbC1PZjh4hVvFzDZ+yYFKmwXM8Sd/VL1TG4pOs4m0H6rKF9wOdh+tjKQ8gBVbX227dbootpEaApV2DeToVaEKa3JTnN7Ea2Nc7W6VJT1LAu0yn6oNbCOHyldEZxWiOeUZvVi+RaATmHon8KbZs4uvA+yzrJAVFsqcq0uiGxjyWlLxMRvDSDtKmqkbYpDQknof0WUtvNkzTMbpn8iudyOlU7lqmMPSdIIHvp9Vz1Tbn4QR6ae8rf74qHR59bJZTdh40jrWGqLRryEAJPa1em1sPcG8QIJPoubftmppnfboR9FWYl4ed5O+VDC29S6sgW1gx5PdtI5kif7JOh2fe4S1zL7pui1cEfwn3/JQpUKw8jX+gK6VJpWTJSjFu8kRf2Uq7nNPr/ZCb2ZrkwCP6lZ0KVYXeH/AO6R91Y4fKRJdDo0c8NB/wA5oOvUXJlQpvgoqXZPEO0cwdXhSodka5eGvI9CDbiritiyPJkvweDpv6KrxWNxA1k7/MD9isqtWXKA6NKPDOjwfYnDt85e7rYK6ZgKNEZGtpN6gz6mV59R2piCQBmJ4XP3VvSxuMcSDTcSf5Vz1KdR+9ItBw/KvQ6KtRpkyHtmNGBm7ff7yuA7SVqTqrrzlGUFzZiSSSSQeH/rc8ldbZ2bXLGmoS05gYa4tOkEGCLXn0VB+5XwZq1bkO82kFroib6R7jevL6mvFSwOWx6vSU7LGX+yNj030wHPdnYA2QLHI0XkwJJBtPBP7W2TRbQOUQ7KZeC2wI8RIzcC7SUphtpupsawYei7KIzOALnQDqZvMfUKeI2uXNcz4agM0jMAJE2kX6H0Kguuahg/kV9NN1Mdue6OW2dlblaXCSDTL8sXDvCYDQIk/TebpzF0MTTsajW75LgwkHTwmCfQJZuyHWOerqSRm1Jym4ndJHoiNwAb/qF7upLidGkiZjyzH8y7Og6mKqYE73F/yFDHDM5XmBdtXEictc84Lz6guuj09rYp3h+IebzYmffX0RHMoDRr5B0In06rdOqR5KZHob/Re5iTWx4eFp7l1g9oYn5sQ7nYOj8gm6eNql3iruI4A5SfRoXOZq2pa4xo0iB7JnCOq6BlzuhTcUUUn2Ot7xrtajx/ucPsmO9ogfMerj9yqDD4Oq7VpHEaK6obPYQM1MNO8AgT+ajLCiiuwdfE0twcP9x/JCG0Wt+Uu6vcrBmz6YBhjZ4kyJ6JKrhHbsg5hv5lGLiwSUgrNqgi1Nw52ge6Rdtp6HUwB3vB6yh/A/zBWjGmiUpVGOU9uHf9gjHawdrCrDguYUm4Afi+yzjTApVB8Ypv4h6KD67SbvP1hKDZ43On0KmzBtGpPsh7K5D7T4DfEN4n6rah8LT4j3WJMUQ4ZCmzdj6l/eDg2Ik8TZPfulkjKxxMwc0+8rjKnbiuCQDQbmIAJqZnRlBDjByt1Hy8eClX7X1zTd//AF4dhEkwZtFrBjiXXGm4WXA6lXsehGlHujsRs9ljGpEaEHoZWDYxfJGWJNjM+y4PZ3bDE5WVKrm1Kd/HDGgOa7ylwb4ZECDr0KzaHb+u8AYeaQ1lsOJ0mTHH6blyqfVLqLy921tO/wC4ZwiluegU+z4tLg3iB/gTFPYFGdx6ud9gvJcP202g13iqOJBFi1hB5WExfjKY2l+0fEeWnla4R4iJkW1a6QOvVdbnNu2voR9mx7E3ZrWiBA5gCfcqL8EDY1H9JA/NeM4Ht9jc7Zqh4JAIcxgETJILY3TrwXRbS7W1g3O3IMpGYGCDJ18wdOgsN/JI24ytbTuPGLkrpncVtkUXavd7t/JBf2fw/wCJ3uV5/V/aKZaPA0mB5HubNtTnEDXQHcmXdtcVmIz4bK24LmVACDoMxgExwn9WU5dmbA3yjtWbBww4nqAT7o9TZ+HtNNpjk1unTcuKods3Mc013U4IuabSWm3ykDju6apfavbbDBtOO8qPBlwbIEwBvixNwIOijU6mSlZQk36DZST9qSR6NSqNaIYxrRujch1cTa7zHtP6rkNj9ssPWaPE6k8DRxb0PiIgjqh7b7XU/hnhlQmoTlacwt4SZOVscQIkSddVzrrauZhVLlb/AH/JslPW+hz/AGv7UUn13UwZZTJAy54cQC15OVt7k77ROokJVMfmaGtYYIFRxnK2D4mjySdRIiIdeYhUg7uHB0tY0io/WZbZtMuNiXO1329ug7OYLD4horY2s1oeTkoSYDT5X1CRDjEkDQD2HXXy4rHJP9/Q6IzcVhRDA1zVAbSouqkb6TX1NMs5ntad433vxTGIYWNOfD1mmLlwexgsbl+SBc/QR5Wx12Cx9Kk2aTnPZTa7K5ppQQYJADnCDIACusTtZoYRALoMHxTymBI4LgXVwvrB/J3+vYpKVS/spP5HmLsYA2YBaJeMpJAy+J0gsBEgSLEQ2BqQW+y/aPD962mWu7uoQ105yGmzWmS2BfneSbm5c7S9y5jq7KZovEuJOXLVdM5XNaT4j+ICeMgQuEZVyPYaQLmO8bA6Yg2fSPCJey14dpeV20FCosaTTFnOSWCR7ts7Y9PKHOpOY6XiGt3Bxy+7QE9VrUabmtPnccrQ6MxNrQf/AGHuvPMB27yMYHPJAtmiS4gDw+JwvDgb79JVdtLtiDVp1A11R7SXC7W5XAjQEGT4Rujkoxq9S3hlE5cuKbvJHrL6zRwB3jKJQK+L/CR1gfovLf8Ar15h782feHNGUREDLv33ka70wztoXNEFkARdpgzAgkknSdOK6M2cUvY+Ov8AQmCL/OekGo46vbb+UfWUucaHDMHBwOhaGkHdYg3XC1+2lVlMODWFp1I8JsYPEcb26Jeh20e9vymNQCWkC8u0MmBx16o061bF7UFbjXgLpR/UdtWxJ6JR+KPFczsjtyWvnu6bm5Yl5JeCJm/Mn6BF/wCsyye8pgRDmZWnKQC6AX6TI05p5dVVjtTv80TyE/zF4ajiCbwNSJgTpPBboUXPcGjeSATMSGl0dYC4av8AtHq94SxtNoMhzS2c9yRJt7DePRRp9p6tVvdtluY5pDiCCW5SGBoBDYcRqTATeIryTWHC+He9hI0abfvXPRto7N7prSCXZi4aR5bH6z7JBjXG+U6SLG9x+q8+wW1JdBNYmYzMc45cwMkgxefoZXQ4XFvp+JgZpo5r33EXtF7ATv13p3Uq04W95/QaHTRk73OhZVfMAGeABlY7aIIuqrZ+1qjWv7trWk+IhrKrc1x5nNgTfU8Odkj2kpuJBqsL8p8wqOE2OUPz3NyJ/lCjLrKmvsepTwijvLQvu9af+FioP3nT/wDLQ1OrKvHk5Yh42p+j1/oHhaf6/T+zztviksvbQ69RP+WVhQxDsrC1jMwuDkpyTeIdlk7lQ4bEhpJDjpY6abtUb4wGBBNoA4chCvKmzkjVcS0qbRe+73TBNo8u6AOKS70uva2+8JltE1G+Om2eF2vFomeOljwVW2k8EMLHAEwbOGhuZIvYLU4RdxsbluPYdzuJHMzbp7Ie0aTy5riJEeJ0TPi8NhEn+yHSwjiJhwHHd6Xum3UKrC7uy1wAGuZsA6g6jWOViqKCUtxlroxSnViwzNAizrct/FR+IcNCAC68kXJG48U9hm13TBYWgmX5hAtyuel9E4GMdpVcagEaeAmdzTdpvGqEnTi9xVBfqKaliL5T4jrxBj/CmXYyq7LIfAhrbH0AK3iO8DiRReJBEwA50CbRcjRBdRxFR4LQWc3kNExv46psEXqNbzY49pc1wbTe4gG4JJni7/AkKja4cAab2mdSDv8ApC6HBOe2mQ57A/NfK6xzHUnQQIuYSuMZWcWC0ZQSS4SC42mLaRG+6jC6m1bQd0la7bKqsHteMoniDYg7yRw3qVTEOacroIALgQDF4vunRvsFNmDqZyXVWgxeGuc20b2zx4Jo7MJyzVFjJmmQGiQCfN6xCu4wQFC2sbiO0i1rKVIRFn1HTqSS1uZ38rZHrzRsPWD3NAoEl5IaXAOktgeGys8DhaD8QwVcoFhnF2gBokkQN7bAT543JjFvAq1G0HEgZofmjzSXEAMIbYmbi6GG+gZxvq2HoE4dzhVd/GDYAAa9lPMIuCYz+a1wN8qVbb1Qg5alTfFmzMD3FtOS2cI+kAJaHOy1CHWcLnxE3BOttdJCVqMLhmsQ0RMkECJ0IB/FeN2t0mRrwbFNL2WRxrn1MhDMzK8lrJm4aHOaOsTpvVG2s0tcMkCczc2rCfC8CNM0CRyXVDC0O5c+lVeyo17QxhebMOSTmA8NnG0brC96F2zqedwfVeXOl8sANy51hMCN9vfcCopXsa0r37lc8kg5XGdYGkifXeQlaWIc5wyglzv8kLsdmYk4aWBjBLS3M6gHF5BiXu1c2STFh0NjztfHNBccrGgm7abMrZECRoQLaf8ACKfkTqRtZtgXNrOaczHQN9iI5HehYV73WFxxJgdFYYRj68mmYDYBkEjxaSdBOU+yLS2OSH1X1qbHaFkG3Ay37LScYrXQnK1roU/eLwA14LbyJNjEem8qdPFlw9TEETBmYnjKFiME4D+IWZSDlcBmcSLnLwsOKg3BmmS1rg9zgLObEDS1ytlwauNd3N5KtM5gLbjPHdPFaxe1axDmEvdMHLJIETuFuF02zG2y1Mkm2W+m+T9ui0MUwHOwCwDYDYN5IkXk/qmkknewJJLZi+B2LUI8RyGxAMyZ4gaX4rQwlYO8TA7KAQWkBrhrrv326poYsG8kknWYv5kLF48BoIdBnyg8ZlSxTb1EuhmlVqUiHBjR+IiCWjmDbfuTTe0vi8rDBsS1h00sGg/VczUxZLSM0xv9vZJscSQAC48NZ9BdUVG61HjUktmdPjdul0gOImJA8IA3WA0mFWNrnUzxnfrfTolKLXTHdv5giR10VmHtu2CByty1/ujGjFaIyvN3bF31STIqRO6462WLdTCuJm275o3cFipkmy2JYSjngk2+YXvpw3XCZw9A03yNwMAm4PEEW/5WLEk5O9iTeodm1IcLQRbiffgrVuNFQBrmg5gR6eoPALSxTqU4rVDJkabqLQWFktka3Pl0Jkc1qs7DgBopiCN+4HzSbu0AvMraxJbm5myFbGyxoFtzWjywATMdJSRxQF5uTw58lixPGCMmWHetqM8TngNBaMsDWJ9baroMJt55+YAEiJa10T6cFixQmrFI1JR2Ogw7nNFQOiS5kHIwaMnKI/EXtuYiEoKRNRzn0HOEiL07AAWHi5fVYsVVTiztzJIWx2EqveW06YY0iZeQXGC0mwMbkXF9lRSbNRwLY8VyTuLiPCI063W1i0lZpIEXiTbKR2z21Kv8IZd7QYktOU5iIgES4ATvEo+Pyh0MADbSIABLSTmj1WLF1wXBzzYHE1XPILjLiB7CwA9ifZHwGmQTmfmDY4lhge62sRqaRE3Y9g9mCtVNNrW2EtzWAaB8sTB8RFxeFHEdlGhxYSM4AgiT0GY9eC0sXLO7nY6o+78zKOx61IyxwfBAAcGkfigaQPVebbYpOp1qjHiCHmQDIE3+xWLFSlEhXd0i52PUqswmI+Wn4ZjLJc1wE8ZF/rxSFRtU1RSM5nRqRcPAynWBr/ZaWI4Vdsk9Ui2GCxDS+mACWOAcQ4WJbu/28EXZ2HovrsFcuaTly5LhwztLDJBLTOY34RAlYsSNW2Ntqi+xfYrBtzufUq5Q10REiA6BpEehKp+1GwKeEE0gS0uADy8l3zGC0wNx9tVixUa0LTinFsF2K2E2rXzVQX08sFrSBLq5FBgObg6rM8glcbgm0yWvaLE+GXaWLTAtBsYm0wsWLRV3cWMVYCapt4Wlu+GtEXsJ13680sxsPFOnYxEnXjrCxYn95ammr2uTe6pTlriDJLRrY5oBN4uhVcQ/eGwdNb6/3WLEyVloZaaIEaxO4e/9itrFiYFz/9k=\" /><h1>Hello Paris</h1>",
        "latitude": 48.8567,
        "longitude": 2.3510,
        "color": colorSet.next(),
        "text": ""
    }, {
        "title": "Reykjavik",
        "latitude": 64.1353,
        "longitude": -21.8952,
        "color": colorSet.next()
    }, {
        "title": "Moscow",
        "latitude": 55.7558,
        "longitude": 37.6176,
        "color": colorSet.next()
    }, {
        "title": "Madrid",
        "latitude": 40.4167,
        "longitude": -3.7033,
        "color": colorSet.next()
    }, {
        "title": "London",
        "latitude": 51.5002,
        "longitude": -0.1262,
        "url": "http://www.google.co.uk",
        "color": colorSet.next()
    }, {
        "title": "Peking",
        "latitude": 39.9056,
        "longitude": 116.3958,
        "color": colorSet.next()
    }, {
        "title": "New Delhi",
        "latitude": 28.6353,
        "longitude": 77.2250,
        "color": colorSet.next()
    }, {
        "title": "Tokyo",
        "latitude": 35.6785,
        "longitude": 139.6823,
        "url": "http://www.google.co.jp",
        "color": colorSet.next()
    }, {
        "title": "Ankara",
        "latitude": 39.9439,
        "longitude": 32.8560,
        "color": colorSet.next()
    }, {
        "title": "Buenos Aires",
        "latitude": -34.6118,
        "longitude": -58.4173,
        "color": colorSet.next()
    }, {
        "title": "Brasilia",
        "latitude": -15.7801,
        "longitude": -47.9292,
        "color": colorSet.next()
    }, {
        "title": "Ottawa",
        "latitude": 45.4235,
        "longitude": -75.6979,
        "color": colorSet.next()
    }, {
        "title": "Washington",
        "latitude": 38.8921,
        "longitude": -77.0241,
        "color": colorSet.next()
    }, {
        "title": "Kinshasa",
        "latitude": -4.3369,
        "longitude": 15.3271,
        "color": colorSet.next()
    }, {
        "title": "Cairo",
        "latitude": 30.0571,
        "longitude": 31.2272,
        "color": colorSet.next()
    }, {
        "title": "Pretoria",
        "latitude": -25.7463,
        "longitude": 28.1876,
        "color": colorSet.next()
    }];



}); // end am4core.ready()