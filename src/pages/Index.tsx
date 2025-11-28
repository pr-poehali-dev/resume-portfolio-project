import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface PersonalInfo {
  fullName: string;
  birthDate: string;
  gender: string;
  education: string;
  phone: string;
  email: string;
  location: string;
  desiredSalary: string;
  position: string;
  about: string;
  photo: string | null;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  period: string;
  description: string;
  achievements: string[];
}

interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  period: string;
  description: string;
}

interface Language {
  id: string;
  name: string;
  level: string;
}

const STORAGE_KEY = 'resume_data';
const LOCK_KEY = 'resume_locked';

export default function Index() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: 'Раздобреев Роман Витальевич',
    birthDate: '24.07.2005',
    gender: 'Мужской',
    education: 'Полное среднее',
    phone: '+7 (900) 123-45-67',
    email: 'roman.razdobreev@example.com',
    location: 'Москва',
    desiredSalary: '80 000 - 120 000 ₽',
    position: 'Frontend Developer',
    about: 'Целеустремленный специалист с опытом разработки современных веб-приложений. Стремлюсь к постоянному развитию и созданию качественных продуктов.',
    photo: 'https://cdn.poehali.dev/files/6ebf0463-a705-43a3-b72c-643a051b05c7.jpg',
    linkedin: 'linkedin.com/in/username',
    github: 'github.com/username',
    portfolio: 'portfolio-site.com'
  });

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: '1',
      company: 'Tech Solutions Ltd',
      position: 'Junior Frontend Developer',
      period: '2023 - настоящее время',
      description: 'Разработка и поддержка веб-приложений на React',
      achievements: ['Оптимизация производительности на 40%', 'Внедрение CI/CD процессов', 'Разработка 15+ компонентов']
    }
  ]);

  const [skills, setSkills] = useState<Skill[]>([
    { id: '1', name: 'JavaScript', level: 85, category: 'Языки программирования' },
    { id: '2', name: 'React', level: 80, category: 'Фреймворки' },
    { id: '3', name: 'TypeScript', level: 75, category: 'Языки программирования' },
    { id: '4', name: 'HTML/CSS', level: 90, category: 'Верстка' },
    { id: '5', name: 'Git', level: 80, category: 'Инструменты' },
    { id: '6', name: 'Figma', level: 70, category: 'Дизайн' }
  ]);

  const [educationList, setEducationList] = useState<Education[]>([
    {
      id: '1',
      institution: 'Московский Технический Университет',
      degree: 'Полное среднее образование',
      period: '2012 - 2023',
      description: 'Успешное завершение программы с отличием'
    }
  ]);

  const [languages, setLanguages] = useState<Language[]>([
    { id: '1', name: 'Русский', level: 'Родной' },
    { id: '2', name: 'Английский', level: 'B2 - Upper Intermediate' }
  ]);

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    const locked = localStorage.getItem(LOCK_KEY);
    
    if (locked === 'true') {
      setIsLocked(true);
    }
    
    if (savedData && locked === 'true') {
      const parsed = JSON.parse(savedData);
      setPersonalInfo(parsed.personalInfo);
      setExperiences(parsed.experiences);
      setSkills(parsed.skills);
      setEducationList(parsed.educationList);
      if (parsed.languages) setLanguages(parsed.languages);
    }
  }, []);

  const handleSaveAndLock = () => {
    const data = {
      personalInfo,
      experiences,
      skills,
      educationList,
      languages,
      lockedAt: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(LOCK_KEY, 'true');
    setIsLocked(true);
    setShowAdminPanel(false);
    
    toast({
      title: '✅ Резюме сохранено',
      description: 'Данные защищены. Панель редактирования скрыта.',
    });
  };

  const handleUnlock = () => {
    const password = prompt('Введите пароль для редактирования:');
    if (password === 'admin123') {
      setShowAdminPanel(true);
      toast({
        title: '🔓 Панель редактирования открыта',
        description: 'Теперь вы можете редактировать резюме',
      });
    } else {
      toast({
        title: '❌ Неверный пароль',
        description: 'Доступ запрещен',
        variant: 'destructive'
      });
    }
  };

  const handleDownloadPDF = async () => {
    if (!resumeRef.current) return;
    
    setIsDownloading(true);
    toast({
      title: '📄 Создание PDF...',
      description: 'Подготовка документа для скачивания',
    });

    try {
      const element = resumeRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0a0e1a',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }

      pdf.save(`${personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
      
      toast({
        title: '✅ PDF готов!',
        description: 'Резюме успешно скачано',
      });
    } catch (error) {
      toast({
        title: '❌ Ошибка',
        description: 'Не удалось создать PDF',
        variant: 'destructive'
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPersonalInfo({ ...personalInfo, photo: reader.result as string });
        toast({
          title: '📸 Фото обновлено',
          description: 'Новая фотография успешно загружена'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoDelete = () => {
    setPersonalInfo({ ...personalInfo, photo: null });
    toast({
      title: '🗑️ Фото удалено',
      description: 'Фотография удалена из профиля'
    });
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#1a1f2e] to-[#0f1419] relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDE0LDE2NSwyMzMsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
      
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>

      {isLocked && !showAdminPanel && (
        <button
          onClick={handleUnlock}
          className="fixed bottom-6 left-6 p-3 rounded-full bg-muted/10 backdrop-blur-sm border border-muted/20 hover:border-primary/50 transition-all z-50 opacity-30 hover:opacity-100"
          title="Панель редактирования"
        >
          <Icon name="Settings" size={20} className="text-muted-foreground" />
        </button>
      )}

      <div className="fixed top-6 right-6 z-50 flex gap-3">
        <Button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          size="lg"
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-xl neon-glow"
        >
          <Icon name={isDownloading ? "Loader2" : "Download"} size={20} className={isDownloading ? "animate-spin" : ""} />
          {isDownloading ? 'Создание PDF...' : 'Скачать PDF'}
        </Button>
      </div>

      <div ref={resumeRef} className="relative max-w-7xl mx-auto py-12 px-4 space-y-6">
        
        {showAdminPanel && (
          <Card className="glass-effect border-primary/30 p-6 animate-fade-in">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Icon name="Shield" className="text-primary" size={24} />
                </div>
                <div>
                  <p className="font-bold text-lg">Панель редактирования</p>
                  <p className="text-sm text-muted-foreground">Внесите изменения и сохраните резюме</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleSaveAndLock} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500">
                  <Icon name="Save" size={18} />
                  Сохранить
                </Button>
                <Button onClick={() => setShowAdminPanel(false)} variant="outline">
                  <Icon name="X" size={18} />
                </Button>
              </div>
            </div>
          </Card>
        )}

        <Card className="glass-effect border-primary/30 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5"></div>
          
          <div className="relative p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start">
              
              <div className="relative group/photo flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-3xl blur-2xl opacity-40 group-hover/photo:opacity-60 transition-opacity"></div>
                
                {personalInfo.photo ? (
                  <div className="relative">
                    <img 
                      src={personalInfo.photo} 
                      alt="Profile" 
                      className="relative w-48 h-48 lg:w-64 lg:h-64 rounded-3xl object-cover border-4 border-primary/40 shadow-2xl"
                    />
                    {showAdminPanel && (
                      <div className="absolute inset-0 bg-black/70 rounded-3xl opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <Button
                          size="icon"
                          className="bg-primary hover:bg-primary/80 h-12 w-12"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Icon name="Upload" size={24} />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          className="h-12 w-12"
                          onClick={handlePhotoDelete}
                        >
                          <Icon name="Trash2" size={24} />
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div 
                    className="relative w-48 h-48 lg:w-64 lg:h-64 rounded-3xl bg-muted/10 flex items-center justify-center border-2 border-dashed border-primary/50 cursor-pointer hover:border-primary transition-colors"
                    onClick={() => showAdminPanel && fileInputRef.current?.click()}
                  >
                    <div className="text-center">
                      <Icon name="Camera" size={56} className="text-primary mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">Загрузить фото</p>
                    </div>
                  </div>
                )}
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handlePhotoUpload}
                  disabled={!showAdminPanel}
                />
              </div>

              <div className="flex-1 space-y-6 w-full">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="space-y-3">
                      <h1 className="text-4xl lg:text-6xl font-extrabold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent leading-tight">
                        {personalInfo.fullName}
                      </h1>
                      <p className="text-2xl lg:text-3xl text-secondary font-semibold">{personalInfo.position}</p>
                    </div>
                    {showAdminPanel && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" className="neon-glow flex-shrink-0">
                            <Icon name="Pencil" size={18} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-effect border-primary/20 max-w-3xl max-h-[85vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-2xl text-primary">Редактировать профиль</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label>ФИО</Label>
                                <Input value={personalInfo.fullName} onChange={(e) => setPersonalInfo({...personalInfo, fullName: e.target.value})} />
                              </div>
                              <div>
                                <Label>Желаемая должность</Label>
                                <Input value={personalInfo.position} onChange={(e) => setPersonalInfo({...personalInfo, position: e.target.value})} />
                              </div>
                              <div>
                                <Label>Дата рождения</Label>
                                <Input value={personalInfo.birthDate} onChange={(e) => setPersonalInfo({...personalInfo, birthDate: e.target.value})} />
                              </div>
                              <div>
                                <Label>Желаемая зарплата</Label>
                                <Input value={personalInfo.desiredSalary} onChange={(e) => setPersonalInfo({...personalInfo, desiredSalary: e.target.value})} />
                              </div>
                              <div>
                                <Label>Телефон</Label>
                                <Input value={personalInfo.phone} onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})} />
                              </div>
                              <div>
                                <Label>Email</Label>
                                <Input value={personalInfo.email} onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})} />
                              </div>
                              <div>
                                <Label>Город</Label>
                                <Input value={personalInfo.location} onChange={(e) => setPersonalInfo({...personalInfo, location: e.target.value})} />
                              </div>
                              <div>
                                <Label>Образование</Label>
                                <Input value={personalInfo.education} onChange={(e) => setPersonalInfo({...personalInfo, education: e.target.value})} />
                              </div>
                              <div>
                                <Label>LinkedIn</Label>
                                <Input value={personalInfo.linkedin} onChange={(e) => setPersonalInfo({...personalInfo, linkedin: e.target.value})} placeholder="linkedin.com/in/username" />
                              </div>
                              <div>
                                <Label>GitHub</Label>
                                <Input value={personalInfo.github} onChange={(e) => setPersonalInfo({...personalInfo, github: e.target.value})} placeholder="github.com/username" />
                              </div>
                              <div className="md:col-span-2">
                                <Label>Портфолио</Label>
                                <Input value={personalInfo.portfolio} onChange={(e) => setPersonalInfo({...personalInfo, portfolio: e.target.value})} placeholder="your-portfolio.com" />
                              </div>
                            </div>
                            <div>
                              <Label>О себе</Label>
                              <Textarea 
                                value={personalInfo.about} 
                                onChange={(e) => setPersonalInfo({...personalInfo, about: e.target.value})}
                                rows={4}
                              />
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>

                  <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-3xl">{personalInfo.about}</p>
                </div>

                <Separator className="bg-primary/20" />

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2 p-4 rounded-xl bg-primary/5 border border-primary/20 hover:border-primary/40 transition-colors">
                    <div className="flex items-center gap-2 text-primary">
                      <Icon name="Cake" size={18} />
                      <span className="text-sm font-medium">Дата рождения</span>
                    </div>
                    <p className="text-lg font-semibold">{personalInfo.birthDate}</p>
                    <p className="text-xs text-muted-foreground">{new Date().getFullYear() - parseInt(personalInfo.birthDate.split('.')[2])} лет</p>
                  </div>
                  
                  <div className="space-y-2 p-4 rounded-xl bg-secondary/5 border border-secondary/20 hover:border-secondary/40 transition-colors">
                    <div className="flex items-center gap-2 text-secondary">
                      <Icon name="Wallet" size={18} />
                      <span className="text-sm font-medium">Желаемая зарплата</span>
                    </div>
                    <p className="text-lg font-semibold">{personalInfo.desiredSalary}</p>
                  </div>

                  <div className="space-y-2 p-4 rounded-xl bg-primary/5 border border-primary/20 hover:border-primary/40 transition-colors">
                    <div className="flex items-center gap-2 text-primary">
                      <Icon name="MapPin" size={18} />
                      <span className="text-sm font-medium">Город</span>
                    </div>
                    <p className="text-lg font-semibold">{personalInfo.location}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a href={`tel:${personalInfo.phone}`} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors border border-primary/10 hover:border-primary/30">
                    <Icon name="Phone" size={18} className="text-primary" />
                    <span className="font-medium text-sm">{personalInfo.phone}</span>
                  </a>
                  <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors border border-primary/10 hover:border-primary/30">
                    <Icon name="Mail" size={18} className="text-primary" />
                    <span className="font-medium text-sm">{personalInfo.email}</span>
                  </a>
                  {personalInfo.linkedin && (
                    <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors border border-primary/10 hover:border-primary/30">
                      <Icon name="Linkedin" size={18} className="text-primary" />
                      <span className="font-medium text-sm">LinkedIn</span>
                    </a>
                  )}
                  {personalInfo.github && (
                    <a href={`https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors border border-primary/10 hover:border-primary/30">
                      <Icon name="Github" size={18} className="text-primary" />
                      <span className="font-medium text-sm">GitHub</span>
                    </a>
                  )}
                  {personalInfo.portfolio && (
                    <a href={`https://${personalInfo.portfolio}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors border border-primary/10 hover:border-primary/30">
                      <Icon name="Globe" size={18} className="text-primary" />
                      <span className="font-medium text-sm">Портфолио</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            <Card className="glass-effect border-primary/20 p-6 lg:p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <Icon name="Briefcase" size={28} className="text-primary" />
                  </div>
                  Опыт работы
                </h2>
                {showAdminPanel && (
                  <Button onClick={() => {
                    const newExp: Experience = {
                      id: Date.now().toString(),
                      company: 'Новая компания',
                      position: 'Должность',
                      period: '2024',
                      description: 'Описание',
                      achievements: ['Достижение']
                    };
                    setExperiences([...experiences, newExp]);
                  }} variant="outline" size="sm" className="neon-glow">
                    <Icon name="Plus" size={16} />
                  </Button>
                )}
              </div>
              
              <div className="space-y-6">
                {experiences.map((exp, index) => (
                  <div key={exp.id} className="relative pl-6 lg:pl-8 pb-8 border-l-2 border-primary/30 last:pb-0">
                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary shadow-lg shadow-primary/50"></div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h3 className="text-xl lg:text-2xl font-bold text-primary">{exp.position}</h3>
                            <Badge className="bg-secondary/20 text-secondary border-secondary/30">{exp.period}</Badge>
                          </div>
                          <p className="text-lg lg:text-xl text-foreground/90 font-medium mb-3">{exp.company}</p>
                          <p className="text-muted-foreground leading-relaxed text-sm lg:text-base">{exp.description}</p>
                          
                          {exp.achievements && exp.achievements.length > 0 && (
                            <div className="mt-4 space-y-2">
                              <p className="text-sm font-semibold text-secondary">Ключевые достижения:</p>
                              <ul className="space-y-2">
                                {exp.achievements.map((achievement, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <Icon name="CheckCircle2" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                                    <span>{achievement}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        
                        {showAdminPanel && (
                          <div className="flex gap-2 flex-shrink-0">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                                  <Icon name="Pencil" size={16} />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="glass-effect border-primary/20 max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle className="text-primary">Редактировать опыт</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                      <Label>Компания</Label>
                                      <Input value={exp.company} onChange={(e) => {
                                        const updated = [...experiences];
                                        updated[index].company = e.target.value;
                                        setExperiences(updated);
                                      }} />
                                    </div>
                                    <div>
                                      <Label>Должность</Label>
                                      <Input value={exp.position} onChange={(e) => {
                                        const updated = [...experiences];
                                        updated[index].position = e.target.value;
                                        setExperiences(updated);
                                      }} />
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Период</Label>
                                    <Input value={exp.period} onChange={(e) => {
                                      const updated = [...experiences];
                                      updated[index].period = e.target.value;
                                      setExperiences(updated);
                                    }} />
                                  </div>
                                  <div>
                                    <Label>Описание</Label>
                                    <Textarea value={exp.description} onChange={(e) => {
                                      const updated = [...experiences];
                                      updated[index].description = e.target.value;
                                      setExperiences(updated);
                                    }} rows={3} />
                                  </div>
                                  <div>
                                    <Label>Достижения (каждое с новой строки)</Label>
                                    <Textarea value={exp.achievements.join('\n')} onChange={(e) => {
                                      const updated = [...experiences];
                                      updated[index].achievements = e.target.value.split('\n').filter(a => a.trim());
                                      setExperiences(updated);
                                    }} rows={4} />
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button variant="ghost" size="icon" onClick={() => setExperiences(experiences.filter(e => e.id !== exp.id))}>
                              <Icon name="Trash2" size={16} className="text-destructive" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="glass-effect border-primary/20 p-6 lg:p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-secondary/10">
                    <Icon name="GraduationCap" size={28} className="text-secondary" />
                  </div>
                  Образование
                </h2>
                {showAdminPanel && (
                  <Button onClick={() => {
                    const newEdu: Education = {
                      id: Date.now().toString(),
                      institution: 'Учебное заведение',
                      degree: 'Степень',
                      period: '2024',
                      description: 'Описание'
                    };
                    setEducationList([...educationList, newEdu]);
                  }} variant="outline" size="sm" className="neon-glow">
                    <Icon name="Plus" size={16} />
                  </Button>
                )}
              </div>
              
              <div className="space-y-6">
                {educationList.map((edu, index) => (
                  <div key={edu.id} className="relative pl-6 lg:pl-8 pb-8 border-l-2 border-secondary/30 last:pb-0">
                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-secondary shadow-lg shadow-secondary/50"></div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h3 className="text-lg lg:text-xl font-bold text-secondary">{edu.institution}</h3>
                            <Badge className="bg-primary/20 text-primary border-primary/30">{edu.period}</Badge>
                          </div>
                          <p className="text-base lg:text-lg text-foreground/90 mb-2">{edu.degree}</p>
                          <p className="text-sm text-muted-foreground">{edu.description}</p>
                        </div>
                        
                        {showAdminPanel && (
                          <div className="flex gap-2 flex-shrink-0">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Icon name="Pencil" size={16} />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="glass-effect border-primary/20">
                                <DialogHeader>
                                  <DialogTitle className="text-secondary">Редактировать образование</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label>Учебное заведение</Label>
                                    <Input value={edu.institution} onChange={(e) => {
                                      const updated = [...educationList];
                                      updated[index].institution = e.target.value;
                                      setEducationList(updated);
                                    }} />
                                  </div>
                                  <div>
                                    <Label>Степень</Label>
                                    <Input value={edu.degree} onChange={(e) => {
                                      const updated = [...educationList];
                                      updated[index].degree = e.target.value;
                                      setEducationList(updated);
                                    }} />
                                  </div>
                                  <div>
                                    <Label>Период</Label>
                                    <Input value={edu.period} onChange={(e) => {
                                      const updated = [...educationList];
                                      updated[index].period = e.target.value;
                                      setEducationList(updated);
                                    }} />
                                  </div>
                                  <div>
                                    <Label>Описание</Label>
                                    <Textarea value={edu.description} onChange={(e) => {
                                      const updated = [...educationList];
                                      updated[index].description = e.target.value;
                                      setEducationList(updated);
                                    }} />
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button variant="ghost" size="icon" onClick={() => setEducationList(educationList.filter(e => e.id !== edu.id))}>
                              <Icon name="Trash2" size={16} className="text-destructive" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="glass-effect border-primary/20 p-6 lg:p-8 lg:sticky lg:top-4">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <Icon name="Code2" size={28} className="text-primary" />
                  </div>
                  Навыки
                </h2>
                {showAdminPanel && (
                  <Button onClick={() => {
                    const newSkill: Skill = {
                      id: Date.now().toString(),
                      name: 'Новый навык',
                      level: 50,
                      category: 'Разное'
                    };
                    setSkills([...skills, newSkill]);
                  }} variant="outline" size="icon" className="neon-glow">
                    <Icon name="Plus" size={16} />
                  </Button>
                )}
              </div>
              
              <div className="space-y-8">
                {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                  <div key={category}>
                    <h3 className="text-xs font-bold text-secondary mb-4 uppercase tracking-wider">{category}</h3>
                    <div className="space-y-4">
                      {categorySkills.map((skill) => {
                        const skillIndex = skills.findIndex(s => s.id === skill.id);
                        return (
                          <div key={skill.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm lg:text-base">{skill.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-primary font-semibold">{skill.level}%</span>
                                {showAdminPanel && (
                                  <>
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7">
                                          <Icon name="Pencil" size={12} />
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="glass-effect border-primary/20">
                                        <DialogHeader>
                                          <DialogTitle className="text-primary">Редактировать навык</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                          <div>
                                            <Label>Название</Label>
                                            <Input value={skill.name} onChange={(e) => {
                                              const updated = [...skills];
                                              updated[skillIndex].name = e.target.value;
                                              setSkills(updated);
                                            }} />
                                          </div>
                                          <div>
                                            <Label>Категория</Label>
                                            <Input value={skill.category} onChange={(e) => {
                                              const updated = [...skills];
                                              updated[skillIndex].category = e.target.value;
                                              setSkills(updated);
                                            }} />
                                          </div>
                                          <div>
                                            <Label>Уровень: {skill.level}%</Label>
                                            <Input type="range" min="0" max="100" value={skill.level} onChange={(e) => {
                                              const updated = [...skills];
                                              updated[skillIndex].level = parseInt(e.target.value);
                                              setSkills(updated);
                                            }} />
                                          </div>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSkills(skills.filter(s => s.id !== skill.id))}>
                                      <Icon name="Trash2" size={12} className="text-destructive" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="relative w-full h-2 bg-muted/30 rounded-full overflow-hidden">
                              <div 
                                className="absolute h-full bg-gradient-to-r from-primary via-secondary to-primary transition-all duration-700 rounded-full shadow-lg shadow-primary/30"
                                style={{ width: `${skill.level}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="glass-effect border-primary/20 p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl lg:text-2xl font-bold flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-secondary/10">
                    <Icon name="Languages" size={24} className="text-secondary" />
                  </div>
                  Языки
                </h2>
                {showAdminPanel && (
                  <Button onClick={() => {
                    const newLang: Language = {
                      id: Date.now().toString(),
                      name: 'Язык',
                      level: 'Уровень'
                    };
                    setLanguages([...languages, newLang]);
                  }} variant="outline" size="icon" className="neon-glow">
                    <Icon name="Plus" size={16} />
                  </Button>
                )}
              </div>
              
              <div className="space-y-4">
                {languages.map((lang, index) => (
                  <div key={lang.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/10 border border-primary/10">
                    <div className="flex-1">
                      <p className="font-semibold text-sm lg:text-base">{lang.name}</p>
                      <p className="text-xs lg:text-sm text-muted-foreground">{lang.level}</p>
                    </div>
                    {showAdminPanel && (
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Icon name="Pencil" size={14} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="glass-effect border-primary/20">
                            <DialogHeader>
                              <DialogTitle className="text-secondary">Редактировать язык</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Язык</Label>
                                <Input value={lang.name} onChange={(e) => {
                                  const updated = [...languages];
                                  updated[index].name = e.target.value;
                                  setLanguages(updated);
                                }} />
                              </div>
                              <div>
                                <Label>Уровень владения</Label>
                                <Input value={lang.level} onChange={(e) => {
                                  const updated = [...languages];
                                  updated[index].level = e.target.value;
                                  setLanguages(updated);
                                }} placeholder="A1, B2, C1, Родной" />
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setLanguages(languages.filter(l => l.id !== lang.id))}>
                          <Icon name="Trash2" size={14} className="text-destructive" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}
