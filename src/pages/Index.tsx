import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface PersonalInfo {
  fullName: string;
  birthDate: string;
  gender: string;
  education: string;
  phone: string;
  email: string;
  location: string;
  photo: string | null;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  period: string;
  description: string;
}

interface Skill {
  id: string;
  name: string;
  level: number;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  period: string;
}

export default function Index() {
  const { toast } = useToast();
  const [editMode, setEditMode] = useState<string | null>(null);

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: 'Раздобреев Роман Витальевич',
    birthDate: '24.07.2005',
    gender: 'Мужской',
    education: 'Полное среднее',
    phone: '+7 (___) ___-__-__',
    email: 'email@example.com',
    location: 'Город',
    photo: 'https://cdn.poehali.dev/files/6ebf0463-a705-43a3-b72c-643a051b05c7.jpg'
  });

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: '1',
      company: 'Название компании',
      position: 'Должность',
      period: '2023 - настоящее время',
      description: 'Описание ваших обязанностей и достижений'
    }
  ]);

  const [skills, setSkills] = useState<Skill[]>([
    { id: '1', name: 'JavaScript', level: 80 },
    { id: '2', name: 'React', level: 75 },
    { id: '3', name: 'TypeScript', level: 70 },
    { id: '4', name: 'Node.js', level: 65 }
  ]);

  const [educationList, setEducationList] = useState<Education[]>([
    {
      id: '1',
      institution: 'Учебное заведение',
      degree: 'Полное среднее образование',
      period: '2012 - 2023'
    }
  ]);

  const handlePhotoDelete = () => {
    setPersonalInfo({ ...personalInfo, photo: null });
    toast({
      title: 'Фото удалено',
      description: 'Фотография успешно удалена из профиля'
    });
  };

  const handleAddExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: 'Новая компания',
      position: 'Должность',
      period: '2024',
      description: 'Описание'
    };
    setExperiences([...experiences, newExp]);
  };

  const handleDeleteExperience = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  const handleAddSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: 'Новый навык',
      level: 50
    };
    setSkills([...skills, newSkill]);
  };

  const handleDeleteSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] via-[#1a1a2e] to-[#16213e] py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        
        <Card className="glass-effect border-primary/20 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-50"></div>
          <div className="relative p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              
              <div className="relative group">
                {personalInfo.photo ? (
                  <div className="relative">
                    <img 
                      src={personalInfo.photo} 
                      alt="Profile" 
                      className="w-48 h-48 rounded-2xl object-cover border-4 border-primary neon-glow"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={handlePhotoDelete}
                    >
                      <Icon name="X" size={16} />
                    </Button>
                  </div>
                ) : (
                  <div className="w-48 h-48 rounded-2xl bg-muted flex items-center justify-center border-2 border-dashed border-primary/50">
                    <Icon name="User" size={64} className="text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-4xl font-bold text-primary neon-text">{personalInfo.fullName}</h1>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" className="neon-glow">
                        <Icon name="Pencil" size={16} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-effect border-primary/20">
                      <DialogHeader>
                        <DialogTitle className="text-primary">Редактировать личные данные</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>ФИО</Label>
                          <Input 
                            value={personalInfo.fullName} 
                            onChange={(e) => setPersonalInfo({...personalInfo, fullName: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Дата рождения</Label>
                          <Input 
                            value={personalInfo.birthDate} 
                            onChange={(e) => setPersonalInfo({...personalInfo, birthDate: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Телефон</Label>
                          <Input 
                            value={personalInfo.phone} 
                            onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input 
                            value={personalInfo.email} 
                            onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Город</Label>
                          <Input 
                            value={personalInfo.location} 
                            onChange={(e) => setPersonalInfo({...personalInfo, location: e.target.value})}
                          />
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Дата рождения</p>
                    <p className="text-lg">{personalInfo.birthDate}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Пол</p>
                    <p className="text-lg">{personalInfo.gender}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Образование</p>
                    <p className="text-lg">{personalInfo.education}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="Phone" size={16} className="text-primary" />
                    <span>{personalInfo.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="Mail" size={16} className="text-primary" />
                    <span>{personalInfo.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="MapPin" size={16} className="text-primary" />
                    <span>{personalInfo.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="glass-effect border-primary/20 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-secondary flex items-center gap-2">
              <Icon name="Briefcase" size={24} className="text-secondary" />
              Опыт работы
            </h2>
            <Button onClick={handleAddExperience} variant="outline" size="sm" className="neon-glow">
              <Icon name="Plus" size={16} />
              Добавить
            </Button>
          </div>
          
          <div className="space-y-4">
            {experiences.map((exp, index) => (
              <div key={exp.id} className="relative p-6 rounded-lg bg-muted/20 border border-primary/10 hover:border-primary/30 transition-all">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold text-primary">{exp.position}</h3>
                      <Badge variant="secondary">{exp.period}</Badge>
                    </div>
                    <p className="text-lg text-foreground/80">{exp.company}</p>
                    <p className="text-sm text-muted-foreground">{exp.description}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Icon name="Pencil" size={16} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="glass-effect border-primary/20">
                        <DialogHeader>
                          <DialogTitle className="text-primary">Редактировать опыт</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Компания</Label>
                            <Input 
                              value={exp.company}
                              onChange={(e) => {
                                const updated = [...experiences];
                                updated[index].company = e.target.value;
                                setExperiences(updated);
                              }}
                            />
                          </div>
                          <div>
                            <Label>Должность</Label>
                            <Input 
                              value={exp.position}
                              onChange={(e) => {
                                const updated = [...experiences];
                                updated[index].position = e.target.value;
                                setExperiences(updated);
                              }}
                            />
                          </div>
                          <div>
                            <Label>Период</Label>
                            <Input 
                              value={exp.period}
                              onChange={(e) => {
                                const updated = [...experiences];
                                updated[index].period = e.target.value;
                                setExperiences(updated);
                              }}
                            />
                          </div>
                          <div>
                            <Label>Описание</Label>
                            <Textarea 
                              value={exp.description}
                              onChange={(e) => {
                                const updated = [...experiences];
                                updated[index].description = e.target.value;
                                setExperiences(updated);
                              }}
                            />
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteExperience(exp.id)}
                    >
                      <Icon name="Trash2" size={16} className="text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="glass-effect border-primary/20 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-secondary flex items-center gap-2">
              <Icon name="Code2" size={24} className="text-secondary" />
              Навыки
            </h2>
            <Button onClick={handleAddSkill} variant="outline" size="sm" className="neon-glow">
              <Icon name="Plus" size={16} />
              Добавить
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {skills.map((skill, index) => (
              <div key={skill.id} className="space-y-2 p-4 rounded-lg bg-muted/20 border border-primary/10">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-lg">{skill.name}</span>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Icon name="Pencil" size={14} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="glass-effect border-primary/20">
                        <DialogHeader>
                          <DialogTitle className="text-primary">Редактировать навык</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Название</Label>
                            <Input 
                              value={skill.name}
                              onChange={(e) => {
                                const updated = [...skills];
                                updated[index].name = e.target.value;
                                setSkills(updated);
                              }}
                            />
                          </div>
                          <div>
                            <Label>Уровень владения: {skill.level}%</Label>
                            <Input 
                              type="range"
                              min="0"
                              max="100"
                              value={skill.level}
                              onChange={(e) => {
                                const updated = [...skills];
                                updated[index].level = parseInt(e.target.value);
                                setSkills(updated);
                              }}
                            />
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteSkill(skill.id)}
                    >
                      <Icon name="Trash2" size={14} className="text-destructive" />
                    </Button>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 rounded-full"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
                <span className="text-sm text-muted-foreground">{skill.level}%</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="glass-effect border-primary/20 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-secondary flex items-center gap-2">
              <Icon name="GraduationCap" size={24} className="text-secondary" />
              Образование
            </h2>
            <Button 
              onClick={() => {
                const newEdu: Education = {
                  id: Date.now().toString(),
                  institution: 'Новое учебное заведение',
                  degree: 'Степень',
                  period: '2024'
                };
                setEducationList([...educationList, newEdu]);
              }} 
              variant="outline" 
              size="sm" 
              className="neon-glow"
            >
              <Icon name="Plus" size={16} />
              Добавить
            </Button>
          </div>
          
          <div className="space-y-4">
            {educationList.map((edu, index) => (
              <div key={edu.id} className="relative p-6 rounded-lg bg-muted/20 border border-primary/10 hover:border-primary/30 transition-all">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold text-primary">{edu.institution}</h3>
                      <Badge variant="secondary">{edu.period}</Badge>
                    </div>
                    <p className="text-lg text-foreground/80">{edu.degree}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Icon name="Pencil" size={16} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="glass-effect border-primary/20">
                        <DialogHeader>
                          <DialogTitle className="text-primary">Редактировать образование</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Учебное заведение</Label>
                            <Input 
                              value={edu.institution}
                              onChange={(e) => {
                                const updated = [...educationList];
                                updated[index].institution = e.target.value;
                                setEducationList(updated);
                              }}
                            />
                          </div>
                          <div>
                            <Label>Степень/Квалификация</Label>
                            <Input 
                              value={edu.degree}
                              onChange={(e) => {
                                const updated = [...educationList];
                                updated[index].degree = e.target.value;
                                setEducationList(updated);
                              }}
                            />
                          </div>
                          <div>
                            <Label>Период обучения</Label>
                            <Input 
                              value={edu.period}
                              onChange={(e) => {
                                const updated = [...educationList];
                                updated[index].period = e.target.value;
                                setEducationList(updated);
                              }}
                            />
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setEducationList(educationList.filter(e => e.id !== edu.id))}
                    >
                      <Icon name="Trash2" size={16} className="text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
}
