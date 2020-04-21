//CopyRight Azat - unknown

import { Component, OnInit, OnDestroy } from '@angular/core';

import { User } from '../_models/User';
import { UserService, AuthenticationService } from '../_services'
import { Router, ActivatedRoute, RouterEvent, NavigationEnd } from '@angular/router';
import { CourseFile } from '../_models/CourseFile';
import { Subject } from 'rxjs';
import { filter, takeUntil, startWith, pairwise } from 'rxjs/operators';

@Component({
  selector: 'app-course-files',
  templateUrl: './course-files.component.html',
  styleUrls: ['./course-files.component.css']
})

export class CourseFilesComponent implements OnInit, OnDestroy {

  loading = true;

  // Current User
  u: User = null;

  // To add File
  fileName = "";
  dirs = [];
  dirName = "";
  students = [];
  //is Teacher
  isT = false;

  //For Form adding file
  addFile = false;

  // Titles to Navigate 
  title: Title[] = [];

  // Files Owner
  owner: User = null;
  
  // Objects: Files or Directories
  objects: Object[] = [];

  public destroyed = new Subject<any>();

  // Current Path
  path: string = "";

  constructor(private userService: UserService, private router: Router, private r: ActivatedRoute, private auth: AuthenticationService) { }

  ngOnInit(): void {
    // https://medium.com/angular-in-depth/refresh-current-route-in-angular-512a19d58f6e
    this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd),
      pairwise(),
      filter((events: RouterEvent[]) => events[0].url === events[1].url),
      startWith('Initial call'),
      takeUntil(this.destroyed)).subscribe(() => {
      this.fetchData();
    });
  }

  fetchData(){
    this.loading = true;
    // Getting Current path then Objects: from current url path
    try
    {
      this.path = decodeURIComponent(this.r.snapshot.paramMap.get('path'));
    }
    catch(error)
    {
      console.error(error)
      this.router.navigate(['/student-files/0/%2F']);        
    }

    if(this.auth.currentUser)
    {
      this.auth.currentUser.subscribe(u => {
        this.u = u;
        if(u.type != "Student")
        { 
          this.isT = true;
          if(+this.r.snapshot.paramMap.get('teacher') == 0)
          {
            this.router.navigate(['/student-files/' + u.id + '/' + this.r.snapshot.paramMap.get('path')]);
          }
        }
      })
      this.userService.getFiles(+this.r.snapshot.paramMap.get('teacher'),this.r.snapshot.paramMap.get('path')).subscribe(f => {
        if(f.NULL)
        {
          console.error(f.NULL)
          this.router.navigate(['/student-files/0/%2F']);        
        }
        else
        {
          this.func(f);
          this.loading = false;
        }
      })
    }
  }

  ngOnDestroy(): void {
    // https://medium.com/angular-in-depth/refresh-current-route-in-angular-512a19d58f6e
    this.destroyed.next();
    this.destroyed.complete();
  }

  func(f: CourseFile[]) {
    // Clear objects
    this.objects = [];

    if(+this.r.snapshot.paramMap.get('teacher') == 0 && f[0].access == "Student")
    {
      let teachs = []
      for(let i = 0; i < f.length; i++)
      {
        if(teachs.find(t => t == f[i].owner.id) == undefined)
        {
          this.objects.push({id: f[i].owner.id + "", name: f[i].owner.first_name + " " + f[i].owner.last_name, is_Dir: true, teacher: f[i].owner.id + "", path: '/%2F',  ico: "../../assets/images/types/teacher.ico"});
          teachs.push(f[i].owner.id);
        }
      }
    }
    else
    {
      this.get(f);
    }
    this.title = []
    //Pre Titles
    if(f[0].access == "Student")
    {
      this.title.push({title: "Teachers", teacher: 0, path: "%2F"});
      if(+this.r.snapshot.paramMap.get('teacher') != 0)
      {
        this.title.push({title: f[0].owner.first_name + " " + f[0].owner.last_name, teacher: +this.r.snapshot.paramMap.get('teacher'), path: "%2F"});
      }
    }
    if(f[0].access == "Teacher")
    {
      this.title.push({title: this.u.first_name + " " + this.u.last_name, teacher: +this.r.snapshot.paramMap.get('teacher'), path: "%2F"})
    }
    // Next Titles
    this.titles();
  }

  // Adding Files(For Teacher)
  add(){
    this.addFile = true;
    document.getElementById('main').classList.add('disable');
    this.userService.getStudents().subscribe(s => this.students = s)
  }

  addDir(){
    if(this.dirName != "" && this.dirs.length < 4)
    {
      this.dirs.push(this.dirName);
    }
    else
    if(this.dirName != "" && this.dirs.length  == 4)
    {
      alert("Max count of Folders!")
    }
    this.dirName = "";
  }

  getSelectValues(select) {
    var result = [];
    var options = select && select.options;
    var opt;
  
    for (var i=0, iLen=options.length; i<iLen; i++) {
      opt = options[i];
  
      if (opt.selected) {
        result.push(opt.value);
      }
    }
    return result;
  }

  save(){
    let selected = this.getSelectValues(document.getElementById("select"));
    if(this.fileName != "" && selected.length != 0)
    {
      let students = [];
      for(let i = 0; i < selected.length; i++)
      {
        students.push(this.students.find(s => s.user.id == selected[i]))
      }
      let path = this.path;
      
      for(let i = 0; i < this.dirs.length; i++){
        if(path.length != 1)
        {
          path += "/";
        }
        path += this.dirs[i];
      }
      this.userService.addFile(this.u.id, path, this.fileName, students).subscribe(body => {
        console.log(body);
        this.addFile = false;
        document.getElementById('main').classList.remove('disable');
        location.reload();
      })
    }
  }

  // Titles
  // Adding until end of directory
  titles(){
    let k = 0;
    if(this.path != "/")
    {
      while(k != -1)
      {
        k += 1;
        let f = k;
        k = this.path.indexOf("/", k);
        if(k == -1)
        {
          this.title.push({title: this.path.substr(f), teacher: +this.r.snapshot.paramMap.get('teacher'), path: encodeURIComponent(this.path)})
        }
        else
        {
          this.title.push({title: this.path.substr(f, k - f), teacher: +this.r.snapshot.paramMap.get('teacher'), path: encodeURIComponent(this.path.substr(0, k))})
        }
      }
    }
  }

  // When clicked Object: Navigate -> Get objects and create titles
  route(obj: Object){
    // If this is a Directory
    if(obj.is_Dir)
    {
      // Navigate with teacher and path information
      this.router.navigate(['/student-files/' + obj.teacher + '/' + obj.path]);
      // Create Title
      this.title.push({title: obj.name, teacher: +obj.teacher, path: obj.path})
      
      // If we are in Teachers path(For Student)
      if(obj.id == obj.teacher)
      {
        this.userService.getFiles(+obj.id, this.r.snapshot.paramMap.get('path')).subscribe(files => this.get(files));
      }
      else
      {
        // If we in Main Path: '/' ('%2F' for URL)
        if(this.r.snapshot.paramMap.get('path') == "%2F")
        {
          this.path = this.path + obj.id
          this.userService.getFiles(+this.r.snapshot.paramMap.get('teacher'), this.r.snapshot.paramMap.get('path') + obj.id).subscribe(files => this.get(files));
        }
        else
        {
          this.path = this.path + '/' + obj.id
          this.userService.getFiles(+this.r.snapshot.paramMap.get('teacher'), this.r.snapshot.paramMap.get('path') + "%2F" + obj.id).subscribe(files => this.get(files));
        }
      }
    }
    // If this is a File
    else
    {
      // Thats just sample. 
      // Here we can get file from server
      alert("This is a File");
    }
  }

  go(title: Title): void {
    // Just go to (more precisely refresh) route
    this.router.navigate(['/student-files/' + title.teacher + '/' + title.path]);  
  }

  // Just Getting Files and Directories From Array CourseFile[]
  get(files: CourseFile[]){
    // Clear Objects to push new objects
    this.objects = [];
    // Temp array of directories: To avoid duplication
    let dirs: String[] = [];
    // Then iterate the CourseFiles(There may be files or directories)
    for(let i = 0; i < files.length; i++){
      // More precisely -> condition means: (is this a File?)
      if(this.path == files[i].path)
      {
        // Then We get Type of File. For example .doc or .txt
        let type: string = "";
        if(files[i].name.indexOf(".") != -1)
        {
          for(let j = 0; j < files[i].name.length; j++){
            if(files[i].name[files[i].name.length - j - 1] == '.'){
              break;
            }
            type += files[i].name[files[i].name.length - j - 1];
          }
        }
        type = type.split("").reverse().join("");

        // Let give to object ico using type
        let icon = "../../assets/images/types/unknown.ico";

        if(type == "doc" || type == "docx")
        {
          icon = "../../assets/images/types/doc.ico";
        }

        if(type == "xls" || type == "xlsx")
        {
          icon = "../../assets/images/types/xls.ico";
        }

        if(type == "txt" || type == "md")
        {
          icon = "../../assets/images/types/txt.ico";
        }

        if(type == "ppt" || type == "pptx")
        {
          icon = "../../assets/images/types/ppt.ico";
        }

        if(type == "pdf")
        {
          icon = "../../assets/images/types/pdf.png";
        }

        if(type == "rar" || type == "zip")
        {
          icon = "../../assets/images/types/rar.png";
        }

        // Temp for a file name to cut(if characters length more than 15 )
        let temp = files[i].name;
        
        if(temp.length > 15)
        {
          temp = temp.substr(0, 7) + "..." + temp.substr(temp.length - 4, 4);
        }
        // Let push our Object: File
        this.objects.push({id: files[i].name, name: temp, is_Dir: false, teacher: this.r.snapshot.paramMap.get('teacher'), path: this.r.snapshot.paramMap.get('path') + "%2F" + files[i].id, ico: icon});
      }
      // Here we get Directory
      else
      {
        // Getting Directory Name
        let temp: string = "";
        let l = this.path;
        if(this.path != "/")
        {
          l += "/";
        }
        for(let j = l.length; j < files[i].path.length; j++)
        {
          if(files[i].path[j] == "/")
          {
            break;
          }
          else
          {
            temp += files[i].path[j]
          }
        }
        // WE got Directory name: temp

        // WE must check: had we add the same directory(temp) to objects 
        if(dirs.find(d => d == temp) == undefined)
        {
          // If not then we add the new directory
          dirs.push(temp);
          // Getting name(cut or full)
          let full = temp;
          if(temp.length > 15)
          {
            temp = temp.substr(0, 7) + "..." + temp.substr(temp.length - 4, 4);
          }
          // Let push our Directory
          // Difference between conditions(bottom): that path name
          // (1) If we in the main path(Where just '/' ('%2F' is the url adding), 
          // we don't add slash (For example "'/' + 'New Directory Name'"), 
          // (2) otherwise we add (For example "'/Directory' + '/' + 'New Directory Name'"))
          if(this.r.snapshot.paramMap.get('path') == "%2F")
          {
            // (1)
            this.objects.push({id: full, name: temp, is_Dir: true, teacher: this.r.snapshot.paramMap.get('teacher'), path: this.r.snapshot.paramMap.get('path') + full, ico: "../../assets/images/types/folder.ico"});
          }
          else
          {
            // (2)
            this.objects.push({id: full, name: temp, is_Dir: true, teacher: this.r.snapshot.paramMap.get('teacher'), path: this.r.snapshot.paramMap.get('path') + "%2F" + full, ico: "../../assets/images/types/folder.ico"});
          }
        }
      }
    }
  }
  // Exit from file adding
  cancel(){
    this.addFile = false;
    document.getElementById('main').classList.remove('disable');
  }
}

// Object interface for Files and Directories or Teachers(For Student)
interface Object 
{
  id: string;
  name: string;
  is_Dir: boolean;
  teacher: string;
  path: string;
  ico: string;
}

// Title interface for navigation
interface Title 
{
  title: string;
  teacher: number;
  path: string;
}