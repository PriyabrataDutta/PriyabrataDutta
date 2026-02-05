const projectRows = `
ritupediatric.in|Jan 28, 2026
goodclassedutech.in|Jan 23, 2026
drhemakrishnaneuro.com|Jan 20, 2026
drhemakrishnaneuro.co|Jan 20, 2026
brundaspecialistclinic.com|Jan 6, 2026
drgowshikkscancercare.com|Jan 2, 2026
drharshagn.com|12/31/25
dhaarahospital.in|12/16/25
dhatrihealthcare.com|12/4/25
growingupclinic.com|12/3/25
velcare.in|11/27/25
karnatakagastrocenter.com|11/20/25
drakshaysorthoclinic.org|11/20/25
pralakshahospital.com|11/5/25
bangalorestrokesupport.com|11/4/25
thedermacare.com|11/4/25
drnarendermplasticsurgeon.com|10/31/25
elvhealthcare.com|10/31/25
adhventhahospital.com|10/31/25
vikshahealthcare.com|10/31/25
mmcabins.in|10/31/25
healthyskinco.in|10/31/25
touchwood.org.in|10/31/25
highaccy.com|10/31/25
lawwale.in|10/30/25
kainatzippers.com|10/30/25
drpradyumna.com|10/30/25
inhouseinterior.co.in|10/30/25
asianportablecabins.com|10/30/25
nrclinics.in|10/30/25
namrathahospitals.com|10/30/25
praanaspecialityhealthcare.com|10/30/25
eandcpower.com|10/30/25
pranavdiabetescenter.com|10/30/25
drvinayural.com|10/30/25
krishnamurthyacupuncturist.com|10/30/25
prasadeyehospital.in|10/30/25
drshalinifertilityspecialist.com|10/30/25
samrudhioffice.in|10/30/25
drsamuelsantoshdentistry.com|10/30/25
sgimotorstarter.com|10/30/25
shettysskincure.com|10/30/25
jupiterhospitalsbangalore.com|10/30/25
shishiramaternityclinic.com|10/30/25
silverlinediagnostics.in|10/30/25
drpruthvirajurologist.com|10/30/25
skinsutraclinic.com|10/29/25
drprashantjoshifertility.com|10/29/25
sudhapreventioncentre.com|10/29/25
thewhitedentalstudio.com|10/29/25
extrusiontech.in|10/29/25
vkdentalcare.co.in|10/29/25
ecolivingcabins.com|10/29/25
aashakiranoldagehome.com|10/29/25
ykarthikdental.com|10/29/25
dentistbangalore.in|10/28/25
drsunilkini.in|10/28/25
dental32clinics.com|10/28/25
drmohannsspine.com|10/28/25
bloomwomenscentre.com|10/28/25
drlokeshmortho.com|10/28/25
bpcabins.com|10/28/25
bharatportablecabins.biz|10/28/25
drkirankumar.com|10/28/25
avivaortho.com|10/28/25
ashmithahospital.com|10/28/25
drhemanthgastrosurgeon.com|10/28/25
androplusbangalore.com|10/28/25
drbhaskarmv.in|10/28/25
abhayhospital.com|10/28/25
drishtinethralaya.com|10/27/25
koldblak.com|10/27/25
clearvieweyeclinics.in|10/27/25
zainpileshospital.com|10/24/25
drvijaygirish.com|10/24/25
zeeonco.com|10/24/25
boregowdalingammahospital.com|10/24/25
drvenkateshwararaourologist.com|10/24/25
vivanbonewomencare.in|10/24/25
drsanjeevchildspecialist.com|10/24/25
boneandbirth.com|10/24/25
starwinenterprises.in|10/24/25
besturologistinbangalore.com|10/24/25
drramrajvemala.com|10/24/25
beautytattva.com|10/24/25
drrajgastro.in|10/24/25
samvithorthopaediccare.in|10/24/25
apurviortho.in|10/24/25
drpraveenmp.co.in|10/24/25
rithikasurgicalandeyeclinic.com|10/24/25
drmeenakshirkamath.com|10/24/25
anjanadriastroandvastu.com|10/24/25
prathimasrinivas.in|10/24/25
myhealthclinic.in|10/24/25
drvinayhematonc.com|10/23/25
surgeonsubbaraya.com|10/21/25
deltasuperspecialityclinic.com|10/15/25
prekshacare.com|9/24/25
jupiterinstitutions.com|9/23/25
bestcardiologist.com|9/20/25
drkishanav.com|9/12/25
drmadhurimsobgyn.com|9/12/25
tapasvipalace.com|9/6/25
drvinitoswalortho.com|8/18/25
drsnehamd.com|8/14/25
uniquehealthcarecentrebsk.com|8/12/25
drbasavarajutagicardiologist.com|8/8/25
healthnesthospital.com|8/7/25
pranekagastroclinic.com|8/7/25
karthikhospital.in|7/31/25
vedantagastro.com|7/25/25
goodclassedutech.com|7/22/25
drgautamkodikalortho.com|7/10/25
drmanoharrao.com|7/1/25
drchetanpatilortho.com|6/25/25
prabhuorthopaediccentre.com|6/25/25
kaanhainteriors.com|6/13/25
navayanaamultispecialityclinic.com|4/18/25
brindhavvanareionhospitals.com|12/30/24
pvrorthomaternity.com|11/13/24
sathyasreeskinclinic.com|9/17/24
`

const workedProjects = projectRows
  .trim()
  .split('\n')
  .map((line, index) => {
    const [domain, addedOn] = line.split('|')

    return {
      id: `${domain}-${index + 1}`,
      domain: domain.trim(),
      addedOn: (addedOn || '').trim(),
      type: 'Third Party'
    }
  })

export default workedProjects
