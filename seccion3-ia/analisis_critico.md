Preguntas:

1. ¿Qué cosas devolvió la IA tal cual usaste y por qué confiabas en ellas?
R: La estructuración del proyecto el planteamiento desde las bases, confien en ella ya que el agente de kiro esta especializado en primero plantear y organizar y luego ejecutar valide todo correctamente

2. ¿Qué cosas devolvió la IA que tuviste que corregir manualmente? Da al menos 2 ejemplos concretos.
    -La sincronización de la base de datos ya que la ia queria sincronizar en parte porque es la manera como maneja sequelize
    -La conección a la base de datos no la estaba ejecutando de manera correcta se tuvo que modificar ya que se creo localmente y manualmente una base de Datos de prueba.

3. ¿Qué validaciones hiciste sobre el código generado? (ej: probaste el endpoint, revisaste SQL, leíste
seguridad)
    -Si lei todo lo que me generaba la ia probe los endpoints con los mismpos test que ella me genero, y funcionaba perfectamente, de igual manera lo construi de primero para que fuera local y luego me pase a dockerizarlo.


4. ¿Encontraste algún bug, riesgo de seguridad o decisión cuestionable en el código generado? ¿Cómo lo
detectaste?
    -Siento que el agente fue muy limpio en parte de lo que se trata en seguridad, miro que genera demasiado, hace una carpeta con algo por algo nuevo que le pido y al final puede ser un problema de seguridad en el sentido que no le va a dar mantenimiento a ese codigo o a esa parte porque fue algo que en algun momento le pidiera que corrigiera.


5. Si tuvieras que volver a hacerlo, ¿qué prompt o estrategia cambiarías? ¿Por qué?
    Creo que plantearia obviamente la dockerización de la base de datos porque esta tomando demasiado tiempo para inizializar la base de datos y por otra parte los datos son mas fragiles y se pierden mas rapido en una instancia o dockerizados.