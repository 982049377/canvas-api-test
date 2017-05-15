class Walk implements State {
      private Walklist: string[];
      private Walkcount = -1;
      private person: Role;
      private i: number = 0;
      private temp: () => void;
      public constructor(pperson: Role, walk: string[]) {
            this.person = pperson;
            this.Walklist = walk;
      }
      onEnter() {
            this.temp = this.PlayWalk;
            engine.startTick(this.temp);
      }

      onExit() {
            this.temp = this.PlayWalk;
            engine.stopTick(this.temp);
      }
      private PlayWalk(): boolean {
            this.Walkcount++;
            this.i++;
            if (this.Walkcount >= this.Walklist.length)
                  this.Walkcount = 0;
            if (this.i == 10) {
                  this.person._role.src = this.Walklist[this.Walkcount];
                  this.i = 0;
            }
            //  console.log("Walk");
            //  console.log(this.Walklist[this.Walkcount]);
            return true;
      }
}