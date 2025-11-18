const XP_PER_LEVEL = 1000;

export const calculateLevelData = (totalExp) => {

    //funcion logar'itmica para el nivel 
    const level = Math.floor(Math.log2(totalExp/100+1)) + 1;
    const expForLevel = (levelInt) => (2 ** (levelInt) - 1) * 100;
    //xp necesario para el siguiente nivel
    const expForNextLevel = expForLevel(level);
    //xp necesario para el nivel actual
    const expForThisLevel = expForLevel(level-1);
    //xp del usuario en su nivel actual
    const currentLevelExp = totalExp - expForThisLevel;
    const expRequiredForLevel = expForNextLevel - expForThisLevel;
    return {
        level: level,             
        currentLevelExp: currentLevelExp, 
        expToNextLevel: expRequiredForLevel 
    };
};