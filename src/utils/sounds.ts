class SoundManager {
  private static instance: SoundManager;
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private muted: boolean = false;

  private constructor() {
    this.sounds = {
      match: new Audio('data:audio/wav;base64,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'),
      powerup: new Audio('data:audio/wav;base64,UklGRpIGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YW4GAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZRQ0PVqzn77BdGAg+ltryxnMpBSl+zPLaizsIGGS57OihUBELTKXh8bllHgU2jdXzzn0vBSF1xe/glEILElyx6OyrWBUIQ5zd8sFuJAUuhM/z1YU2Bhxqvu7mnEgODlOq5O+zYBoGPJPY88p2KwUme8rx3I4+CRZiturqpVITC0mi4PK8aB8GM4nU8tGAMQYfcsLu45ZFDBFYr+ftrVoXCECY3PLEcSYELIHO8diJOQgZaLvt559NEAxPqOPwtmMcBjiP1/PMeS0GI3fH8N2RQAoUXrTp66hVFApGnt/yvmwhBTCG0fPTgjQGHW/A7eSaRQ0PVqzm77BdGAg+ltrzxnUoBSh+zPDaizsIGGS56+mjTxELTKXh8bllHgU1jdT0z3wvBSJ1xe/glEILElyx6OyrWRUIRJve8sFuJAUug8/z1YU2BRxqvu7mnEgODlOq5O+zYRsGPJPY88p3KgUme8rx3I4+CRVht+rqpVMSC0mh4PK8aiAFM4nU8tGAMQYfccPu45ZFDBFYr+ftrVwWCECY3PLEcSYGK4DN8tiIOQgZZ7zs56BODwxPpuPxtmQcBjiP1/PMeywGI3fH8N+RQAoUXrTp66hWEwlGnt/yv2wiBDCG0fPTgzQGHm/A7eSaSg0PVqzm77BdGAg+ltvyxnUoBSh9y/HajDsIF2W56+mjUREKTKPi8blnHgU1jdTy0HwvBSF1xe/glEQKElux6eyrWRUJQ5vd88FwJAQug8/z1YY2BRxqvu3mnEgODlOq5O+zYRsGOpPY88p3KgUmfMrx3I4+CRVht+rqpVMSC0mh4PK8aiAFM4nU8tGAMQYfccLu45ZGCxFYr+ftrVwXCECY3PLEcSYGK4DN8tiIOQgZZ7vs56BODwxPpuPxtmQdBTiP1/PMeywGI3fH8N+RQQkUXrTp66hWFQlGnt/yv2wiBDCG0fPTgzQGHm/A7eSaSg0PVqzm77BdGAg+ltvyxnUoBSh9y/HajDwIF2W56+mjUREKTKPi8blnHgU1jdTy0HwvBSF1xe/glEQKElux6eyrWRUJQ5vd88FwJAQug8/z1YY3BRxqvu3mnEgODlOq5O+zYRsGOpPY88p3KgUmfMrx3I4+CRVht+rqpVMSC0mh4PK8aiAFM4nU8tGAMQYfccLu45ZGDRFYr+ftrVwXCECY3PLEcSYGK4DN8tiIOQgZZ7vs56BODwxPpuPxtmQdBTiP1/PMeywGI3fH8N+RQQkUXrTp66hWFQk=')
    };
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  public playSound(soundName: 'match' | 'powerup'): void {
    if (!this.muted && this.sounds[soundName]) {
      const sound = this.sounds[soundName];
      sound.currentTime = 0;
      sound.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  }

  public toggleMute(): void {
    this.muted = !this.muted;
  }

  public isMuted(): boolean {
    return this.muted;
  }
}

export const soundManager = SoundManager.getInstance();